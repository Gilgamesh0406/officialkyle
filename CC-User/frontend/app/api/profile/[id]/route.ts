//@ts-ignore
import { NextResponse } from 'next/server';
import { getUserById } from '@/prisma/db/users';
import { cookies } from 'next/headers';
import { getTwoFA } from '@/prisma/db/twofa';
import {
  getUserBets,
  getUserWinnings,
} from '@/prisma/db/userWinnings';
import { get_sessions_by_userid } from '@/prisma/db/sessions';
import { calculateLevel, serializeData } from '@/lib/server/utils';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract the 'id' from route parameters

  if (!id) {
    return NextResponse.json({
      error: 'User ID is required.',
    });
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' });
    }

    const response: any = {
      looking: true,
      profile: user,
    };

    // Two-factor authentication
    const twofa = await getTwoFA(id);
    response.twofa = !!twofa;

    // User stats
    const winnings = await getUserWinnings(id);
    const bets = await getUserBets(id);
    response.user_stats = {
      //@ts-ignore
      win: Math.abs(winnings._sum.amount || 0),
      //@ts-ignore
      bet: Math.abs(bets._sum.amount || 0),
    };

    response.level = calculateLevel(Number(user.xp));

    // User sessions
    response.user_sessions = await get_sessions_by_userid(id);

    return NextResponse.json(JSON.parse(serializeData(response)));
  } catch (error) {
    console.log('[API]', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
