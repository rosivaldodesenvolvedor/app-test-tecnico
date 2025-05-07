
import { PrismaClient } from "@prisma/client";

export function PrismaGetInstance(): PrismaClient {
  const prisma = new PrismaClient();

  return prisma;
}

