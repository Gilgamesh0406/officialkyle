import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the user ID from cookies
    const cookieStore = cookies();
    const userId = cookieStore.get('userid')?.value;
    console.log("[userId]", userId)
    // Fetch muted users
    const mutedUsers = await prisma.userRestriction.findMany({
      where: {
        restriction: 'mute',
        removed: false,
        byuserid: userId ? userId: '-1'
      },
      select: {
        userid: true,
      },
    });

    // Extract user IDs
    const userIds = mutedUsers.map((user) => user.userid);

    return NextResponse.json(userIds);
  } catch (error) {
    console.error('Error fetching muted users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
