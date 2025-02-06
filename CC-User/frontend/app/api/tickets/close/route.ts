import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { supportid } = await req.json();

    await prisma.supportTicket.updateMany({
      data: {
        closed: true,
      },
      where: {
        id: supportid,
      },
    });
    return NextResponse.json("success", { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
