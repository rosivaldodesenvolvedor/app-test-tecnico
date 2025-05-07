import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { Account } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns";
import { cookies } from "next/headers";

interface RegisterProps {
  name: string;
  email: string;
  password: string;
  password2: string;
}

export interface RegisterResponse {
  error?: string;
  user?: Account;
}

const EMAIL_REGEX =
  /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;

export async function POST(request: Request) {
  const { name, email, password, password2 }: RegisterProps =
    await request.json();

  const validationError = validateInput(email, password, password2);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const sessionToken = GenerateSession({ email, passwordHash });
  const sessionExpires = addHours(new Date(), 24);

  try {
    const prisma = PrismaGetInstance();

    const account = await prisma.account.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    await prisma.sessions.create({
      data: {
        userId: account.id,
        token: sessionToken,
        valid: true,
        expiresAt: sessionExpires,
      },
    });

    cookies().set({
      name: "auth-session",
      value: sessionToken,
      httpOnly: true,
      expires: sessionExpires,
      path: "/",
    });

    return NextResponse.json({ account }, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "user already exists" },
        { status: 400 }
      );
    }

    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: "registration failed" }, { status: 500 });
  }
}

function validateInput(
  email: string,
  password: string,
  password2: string
): string | null {
  if (!email || !password || !password2) {
    return "missing required fields";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "invalid email";
  }

  if (password.length < 8) {
    return "password must be at least 8 characters";
  }

  if (password !== password2) {
    return "passwords do not match";
  }

  return null;
}
