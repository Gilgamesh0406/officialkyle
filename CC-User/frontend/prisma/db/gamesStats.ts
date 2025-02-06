import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getGamesStats(userId: string) {
  const transactionStats = await prisma.userTransaction.groupBy({
    by: ['service'],
    where: {
      userid: userId,
      service: {
        in: [
          'coinflip_bet',
          'coinflip_win',
          'coinflip_refund',
          'unboxing_bet',
          'unboxing_win',
          'casebattle_bet',
          'casebattle_win',
          'casebattle_refund',
          'casebattle_cashback',
          'plinko_bet',
          'plinko_win',
        ],
      },
    },
    _sum: { amount: true },
  });

  const itemTransactionStats = await prisma.userItemTransaction.groupBy({
    by: ['service'],
    where: {
      userid: userId,
      service: { in: ['unboxing_win', 'casebattle_win'] },
    },
    _sum: { amount: true },
  });

  // Combine and process the results
  const combinedStats = [...transactionStats, ...itemTransactionStats];
  const gamesStats: any = {};

  combinedStats.forEach((stat) => {
    const [game, action] = stat.service.split('_');
    if (!gamesStats[game]) {
      gamesStats[game] = { bet: 0, win: 0, refund: 0, cashback: 0 };
    }
    //@ts-ignore
    gamesStats[game][action] = Math.abs(stat._sum.amount || 0);
  });

  return gamesStats;
}
