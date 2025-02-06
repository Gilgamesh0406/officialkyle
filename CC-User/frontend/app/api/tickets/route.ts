import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { convertBigIntToString } from "@/lib/client/utils";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  if (!userid || userid === "") {
    return NextResponse.json([], { status: 200 });
  }
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        messages: true,
        receivers: true,
      },
      where: { userid: userid },
      orderBy: { time: "desc" },
    });

    const convertedTickets = convertBigIntToString(
      tickets.map(convertBigIntToString)
    );
    return NextResponse.json(convertedTickets, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  try {
    const { title, department, message, image } = await req.json();

    if (!title || !message || message.length < 10) {
      return NextResponse.json(
        {
          message:
            "Title and message are required, and the message must be at least 10 characters.",
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
      const newSupport = await prisma.supportTicket.create({
        data: {
          title,
          department,
          userid: userid ? userid : "",
          name: user.username,
          avatar: user.avatar,
          xp: user.xp,
          time: Date.now(),
        },
      });

      const newSupportMessage = await prisma.supportMessage.create({
        data: {
          supportid: newSupport.id,
          message: message,
          userid: userid ? userid : "",
          name: user.username,
          image: image,
          avatar: user.avatar,
          xp: user.xp,
          time: Date.now(),
        },
      });

      return NextResponse.json(
        {
          ...newSupport,
          id: newSupport.id.toString(),
          xp: newSupport.xp.toString(),
          department: newSupport.department.toString(),
          message: newSupportMessage.message,
          time: newSupport.time.toString(),
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to find user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
