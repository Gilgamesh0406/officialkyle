import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  const user = await prisma.user.findFirst({
    where: {
      userid,
    },
  });
  if (!user)
    return NextResponse.json(
      {
        error: "User not found",
      },
      { status: 400 }
    );
  return NextResponse.json({
    tradelink: user.tradelink,
  });
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tradelink } = body;
  const userid = req.cookies.get("userid")?.value;

  await prisma.user.updateMany({
    where: {
      userid,
    },
    data: {
      tradelink,
    },
  });

  return NextResponse.json("success");
}
