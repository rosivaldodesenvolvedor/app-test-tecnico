import { PrismaGetInstance } from "@/lib/prisma-pg";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const prisma = PrismaGetInstance();

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "email not provided." }, { status: 400 });
  }

  try {
    const account = await prisma.account.findUnique({
      where: { email },
    });

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error when searching for account.", details: String(error) },
      { status: 500 }
    );
  }
}
