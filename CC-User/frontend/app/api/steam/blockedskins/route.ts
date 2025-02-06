import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const blockedSkins = await prisma.blockedSkin.findMany();
  return NextResponse.json({ blockedSkins });
}
