import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Fetch mute restriction for the specified user
    const mutedUser = await prisma.userRestriction.findFirst({
      where: {
        byuserid: userId,
        restriction: 'mute',
        removed: false,
      },
      select: {
        userid: true
      },
    });

    if (!mutedUser) {
      return NextResponse.json({ message: 'User is not muted or does not exist' }, { status: 404 });
    }

    return NextResponse.json(mutedUser);
  } catch (error) {
    console.error('Error fetching muted user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
