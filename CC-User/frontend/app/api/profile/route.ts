//@ts-ignore
import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

import { getUserById } from '@/prisma/db/users';
import { cookies } from 'next/headers';
import { getTwoFA } from '@/prisma/db/twofa';
import {
  getUserBets,
  getUserTransactions,
  getUserTransactionsCount,
  getUserWinnings,
} from '@/prisma/db/userWinnings';
import { get_session, get_sessions_by_userid } from '@/prisma/db/sessions';
import { getUserTransfers } from '@/prisma/db/userTransfers';
import {
  getSteamTransactions,
  getSteamTransactionsCount,
} from '@/prisma/db/steamTransactions';
import {
  getP2PTransactions,
  getP2PTransactionsCount,
} from '@/prisma/db/p2pTransactions';
import {
  getCryptoTransactions,
  getCryptoTransactionsCount,
} from '@/prisma/db/cryptoTransactions';
import { getGamesStats } from '@/prisma/db/gamesStats';
// import { getOffersStats } from '@/prisma/db/offersStats';
import { getUserBinds } from '@/prisma/db/usersBinds';
import { calculateLevel, serializeData } from '@/lib/server/utils';

const handler = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userid')?.value;

  if (!userId) {
    return NextResponse.json({
      error: 'Please log in.',
    });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' });
    }

    const response: any = {
      looking: true,
      profile: user,
    };

    // Two-factor authentication
    const twofa = await getTwoFA(userId);
    response.twofa = !!twofa;

    // User stats
    const winnings = await getUserWinnings(userId);
    const bets = await getUserBets(userId);
    response.user_stats = {
      //@ts-ignore
      win: Math.abs(winnings._sum.amount || 0),
      //@ts-ignore
      bet: Math.abs(bets._sum.amount || 0),
    };

    response.level = calculateLevel(Number(user.xp));

    // User sessions
    response.user_sessions = await get_sessions_by_userid(userId);

    // res.status(200).json(response);
    return NextResponse.json(JSON.parse(serializeData(response)));
  } catch (error) {
    console.log('[API]', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
};

export { handler as GET };
