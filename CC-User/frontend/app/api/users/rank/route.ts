import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userid = req.cookies.get("userid")?.value;
  try {
    const response = await prisma.user.findFirst({
      where: {
        userid: userid,
      },
    });
    const rank = response?.rank;

    return NextResponse.json({
      rank: parseInt(rank + ""),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "User not found",
      },
      { status: 400 }
    );
  }
}
