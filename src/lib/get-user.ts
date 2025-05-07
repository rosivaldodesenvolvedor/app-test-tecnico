import { cookies } from "next/headers";
import { PrismaGetInstance } from "@/lib/prisma-pg";

export async function getUserFromSession() {
  const authCookie = cookies().get("auth-session");
  const sessionToken = authCookie?.value || "";

  const prisma = PrismaGetInstance();
  const session = await prisma.sessions.findFirst({
    where: { token: sessionToken },
  });

  if (!session || !session.valid || session.expiresAt < new Date()) {
    return null;
  }

  const account = await prisma.account.findFirst({
    where: { id: session.userId },
  });

  return account;
}

export async function getUser(email: String) {
  const prisma = PrismaGetInstance();
  const account = await prisma.account.findFirst({
    where: { email },
  });

  return account;
}
