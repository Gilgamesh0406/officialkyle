import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  try {
    const { supportid, message, image } = await req.json();

    if (!supportid || !message || !image) {
      return NextResponse.json(
        {
          message: "Title and message are required",
        },
        { status: 400 }
      );
    }
    const user = await prisma.user.findFirst({
      where: {
        userid,
      },
    });

    if (user) {
      const newSupportMessage = await prisma.supportMessage.create({
        data: {
          supportid: supportid,
          message: message,
          userid: userid ? userid : "",
          name: user.username,
          avatar: user.avatar,
          image: image,
          xp: user.xp,
          time: Date.now(),
        },
      });

      return NextResponse.json(
        {
          ...newSupportMessage,
          id: newSupportMessage.id.toString(),
          xp: newSupportMessage.xp.toString(),
          supportid: newSupportMessage.supportid.toString(),
          response: newSupportMessage.response.toString(),
          time: newSupportMessage.time.toString(),
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to send reply" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending reply:", error);
    return NextResponse.json(
      { message: "Failed to send reply" },
      { status: 500 }
    );
  }
}
