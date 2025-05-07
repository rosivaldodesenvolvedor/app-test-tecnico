import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/get-user";

export async function GET(request: NextRequest) {
  const account = await getUserFromSession();

  if (!account) {
    return NextResponse.json({ user: "Unauthorized" }, { status: 200 });
  }

  return NextResponse.json({ account }, { status: 200 });
}
