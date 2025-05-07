import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaGetInstance } from "@/lib/prisma-pg";

export async function POST() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("auth-session")?.value;

  const prisma = PrismaGetInstance();

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 401 }
    );
  }

  // Invalida a sessão no banco de dados
  await prisma.sessions.updateMany({
    where: {
      token: sessionToken,
      valid: true,
    },
    data: {
      valid: false,
    },
  });

  cookieStore.delete("auth-session");

  return NextResponse.json({ message: "Logout successful" });
}

// export async function Get() {
//   const cookieStore = cookies();
//   const sessionToken = cookieStore.get("auth-session")?.value;

//   const prisma = PrismaGetInstance();

//   if (!sessionToken) {
//     return NextResponse.json(
//       { error: "Session not found" },
//       { status: 401 }
//     );
//   }

//   // Invalida a sessão no banco de dados
//   await prisma.sessions.updateMany({
//     where: {
//       token: sessionToken,
//       valid: true,
//     },
//     data: {
//       valid: false,
//     },
//   });

//   cookieStore.delete("auth-session");

//   return NextResponse.json({ message: "Logout successful" });
// }
