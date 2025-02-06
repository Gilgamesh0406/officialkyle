import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  const body = await req.json();
  const { verificationCode } = body;
  const userDiscordLink = await prisma.userDiscordLink.findFirst({
    where: {
      verification_code: verificationCode,
    },
  });
  const userDiscordLink2 = await prisma.userDiscordLink.findFirst({
    where: {
      userid: userid,
    },
  });
  if (userDiscordLink2) {
    return NextResponse.json(
      { error: "You have already verified your Discord account" },
      { status: 400 }
    );
  }
  if (!userDiscordLink) {
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 }
    );
  }
  await prisma.userDiscordLink.update({
    where: {
      id: userDiscordLink.id,
    },
    data: {
      userid: userid,
      verified: true,
    },
  });
  // await prisma.user.update({
  //   where: {
  //     userid: userid,
  //   },
  //   data: {
  //     balance: {
  //       increment: 5,
  //     },
  //   },
  // });
  // await prisma.userTransaction.create({
  //   data: {
  //     userid: userid!,
  //     service: "Discord Verification Claim Reward",
  //     amount: 5,
  //     time: Date.now(),
  //   },
  // });
  return NextResponse.json(
    { message: "Verification successful" },
    { status: 200 }
  );
}
