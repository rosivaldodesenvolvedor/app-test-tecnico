import { PrismaGetInstance } from "@/lib/prisma-pg";
import { NextResponse } from "next/server";

interface UserProps {
    id: string;
  }

export async function GET() {
    const prisma = PrismaGetInstance();
    const accounts = await prisma.account.findMany();
  
    return NextResponse.json(accounts, { status: 200 });
  }