import { PrismaGetInstance } from "@/lib/prisma-pg";
import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/get-user";

export async function GET() {
  const prisma = PrismaGetInstance();
  const user = await getUserFromSession();

  const filters: any = {
    reversed: false,
    fromUserId: user?.id,
  };

  const transactions = await prisma.transaction.findMany({
    where: filters,
  });

  return NextResponse.json(transactions, { status: 200 });
}
