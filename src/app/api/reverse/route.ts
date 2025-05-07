import { PrismaGetInstance } from "@/lib/prisma-pg";
import { getUserFromSession } from "@/lib/get-user";
import { NextResponse } from "next/server";

interface ReversalRequest {
  transactionId: string;
}

export async function POST(request: Request) {
  const { transactionId }: ReversalRequest = await request.json();
  const prisma = PrismaGetInstance();
  const user = await getUserFromSession();

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.reversed) {
    return NextResponse.json(
      { error: "Invalid or already reversed" },
      { status: 400 }
    );
  }

  if (transaction.fromUserId !== user?.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const fromUser = await prisma.account.findUnique({
    where: { id: transaction.fromUserId },
  });
  const toUser = await prisma.account.findUnique({
    where: { id: transaction.toUserId },
  });

  if (!fromUser || !toUser || toUser.balance < transaction.amount) {
    return NextResponse.json(
      { error: "Cannot reverse transaction" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.account.update({
      where: { id: fromUser.id },
      data: { balance: fromUser.balance + transaction.amount },
    }),
    prisma.account.update({
      where: { id: toUser.id },
      data: { balance: toUser.balance - transaction.amount },
    }),
    prisma.transaction.update({
      where: { id: transaction.id },
      data: { reversed: true },
    }),
  ]);

  return NextResponse.json({ success: true }, { status: 200 });
}
