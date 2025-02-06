import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  const ip = data.ip;

  await prisma.userIp.create({
    data: { ip, userid: userid!, time: Date.now() },
  });
  return NextResponse.json("success");
}
