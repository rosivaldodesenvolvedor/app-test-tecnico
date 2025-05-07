import { NextResponse } from "next/server";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { getUserFromSession, getUser } from "@/lib/get-user";

interface UpdateUserProps {
  balance: number;
  destinationEmail: string;
}

export async function PUT(request: Request) {
  const prisma = PrismaGetInstance();

  const { destinationEmail, balance }: UpdateUserProps = await request.json();

  if (!destinationEmail || typeof balance !== "number" || balance <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const originUser = await getUserFromSession();
  const destinationUser = await getUser(destinationEmail);

  const originEmail = originUser?.email ?? "";
  const originBalance = originUser?.balance ?? 0;
  const destinationBalance = destinationUser?.balance ?? 0;

  if (!originEmail) {
    return NextResponse.json(
      { error: "Origin user not found" },
      { status: 400 }
    );
  }

  if (originBalance < balance) {
    return NextResponse.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  try {
    // Atualiza o saldo do remetente
    const originUser = await prisma.account.update({
      where: { email: originEmail },
      data: { balance: originBalance - balance },
    });

    // Atualiza o saldo do destinatário
    const destinationUser = await prisma.account.update({
      where: { email: destinationEmail },
      data: { balance: destinationBalance + balance },
    });

    await prisma.transaction.create({
      data: {
        fromUserId: originUser.id,
        toUserId: destinationUser.id,
        toUserName: destinationUser.name,
        amount: balance,
      },
    });

    return NextResponse.json(
      { description: "Transaction completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "User not found or update failed" },
      { status: 400 }
    );
  }
}
