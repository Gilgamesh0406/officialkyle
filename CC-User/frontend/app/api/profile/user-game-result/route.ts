import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/prisma/db/users';
import { getUserBets, getUserWinnings } from '@/prisma/db/userWinnings';
import { serializeData } from '@/lib/server/utils';

const handler = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userid')?.value;
  if (!userId) {
    return NextResponse.json({
      error: 'Please log in.',
    });
  }

  const user = await getUserById(userId);

  if (!user) {
    // return res.status(404).json({ error: 'User not found' });
    return NextResponse.json({ error: 'User not found' });
  }

  // User stats
  const winnings = await getUserWinnings(userId);
  const bets = await getUserBets(userId);
  const res = JSON.parse(
    serializeData({
      userId: user.userid,
      username: user.username,
      avatarUrl: user.avatar,
      winAmount: winnings._sum.amount,
      betAmount: bets._sum.amount,
    })
  );
  return NextResponse.json({
    ...res,
    winAmount: parseFloat(res.winAmount),
    betAmount: parseFloat(res.betAmount),
  });
};

export { handler as GET };
