import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const userid = req.cookies.get("userid")?.value;
    const userDiscordLink = await prisma.userDiscordLink.findFirst({
      where: {
        userid: userid,
        verified: true,
      },
    });
    console.log(userDiscordLink);

    if (userDiscordLink) {
      return NextResponse.json(
        { discord_id: userDiscordLink.discord_id },
        { status: 200 }
      );
    }

    return NextResponse.json({ discord_id: null }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ discord_id: null }, { status: 200 });
  }
}
