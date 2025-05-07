import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { cookies } from "next/headers";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns";

interface LoginProps {
  email: string;
  password: string;
}

export interface LoginResponse {
  session: string;
}

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const prisma = PrismaGetInstance();
  const authCookie = cookies().get("auth-session");

  const sessionToken = authCookie?.value ?? "";

  const session = await prisma.sessions.findFirst({
    where: { token: sessionToken },
  });

  const sessionExpired = !session || !session.valid || session.expiresAt < new Date();

  if (sessionExpired) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  return NextResponse.json({}, { status: 200 });
}

/**
 * Realiza o login do usuário, cria uma sessão e define cookie.
 */
export async function POST(request: Request) {
  const prisma = PrismaGetInstance();

  const { email, password }: LoginProps = await request.json();

  if (!email || !password) {
    return NextResponse.json<LoginResponse>({ session: "Invalid input" }, { status: 400 });
  }

  try {
    const account = await prisma.account.findUniqueOrThrow({ where: { email } });

    const passwordMatch = bcrypt.compareSync(password, account.password);

    if (!passwordMatch) {
      return NextResponse.json<LoginResponse>({ session: "Invalid data" }, { status: 400 });
    }

    const sessionToken = GenerateSession({
      email,
      passwordHash: account.password,
    });

    const sessionExpiration = addHours(new Date(), 24);

    await prisma.sessions.create({
      data: {
        userId: account.id,
        token: sessionToken,
        valid: true,
        expiresAt: sessionExpiration,
      },
    });

    cookies().set({
      name: "auth-session",
      value: sessionToken,
      httpOnly: true,
      expires: sessionExpiration,
      path: "/",
    });

    return NextResponse.json<LoginResponse>({ session: sessionToken }, { status: 200 });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
  }
}
