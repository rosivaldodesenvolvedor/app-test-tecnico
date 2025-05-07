import { PrismaGetInstance } from "@/lib/prisma-pg";
import { NextResponse } from "next/server";

export async function GET() {
    const prisma = PrismaGetInstance();
  
   
    const transactions = await prisma.transaction.findMany({
      where: {
        reversed: false
      }
    });
  
    return NextResponse.json(transactions, { status: 200 });
  }