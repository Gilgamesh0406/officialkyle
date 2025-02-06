import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const userid = request.cookies.get("userid")?.value;

  try {
    const bannedUsers = await prisma.userRestriction.findMany({
      where: {
        restriction: "ban",
        removed: false,
        byuserid: userid ? userid : "-1",
      },
      select: {
        userid: true,
      },
    });
    const userIds = bannedUsers.map((user) => user.userid);
    return NextResponse.json(userIds);
  } catch (error) {
    console.error("Error fetching banned users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
