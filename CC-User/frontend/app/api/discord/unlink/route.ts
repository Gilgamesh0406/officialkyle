import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  const userDiscordLink = await prisma.userDiscordLink.findFirst({
    where: {
      userid: userid,
      verified: true,
    },
  });
  if (userDiscordLink) {
    await prisma.userDiscordLink.delete({
      where: { id: userDiscordLink.id },
    });
    return NextResponse.json({ message: "Unlink" });
  }
  return NextResponse.json({ message: "Not linked" });
}
