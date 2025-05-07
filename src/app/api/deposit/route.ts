import { NextResponse } from "next/server";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { getUserFromSession } from "@/lib/get-user";

interface UpdateUserProps {
  balance: number;
}

export async function PUT(request: Request) {
  const prisma = PrismaGetInstance();

  const { balance }: UpdateUserProps = await request.json();

  if (typeof balance !== "number" || balance <= 0) {
    return NextResponse.json({ error: "Invalid balance input" }, { status: 400 });
  }

  const user = await getUserFromSession();

  const currentEmail = user?.email;
  const currentBalance = user?.balance ?? 0;

  if (!currentEmail) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const updatedUser = await prisma.account.update({
      where: { email: currentEmail },
      data: { balance: currentBalance + balance },
    });

    return NextResponse.json(
      { description: "Transaction completed successfully" },
      { status: 200 });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "User not found or update failed" },
      { status: 400 }
    );
  }
}