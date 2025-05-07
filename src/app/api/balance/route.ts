import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/get-user";

/**
 * Retorna os dados do usuário autenticado com base na sessão.
 */
export async function GET(request: NextRequest) {
  const account = await getUserFromSession();

  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ account }, { status: 200 });
}