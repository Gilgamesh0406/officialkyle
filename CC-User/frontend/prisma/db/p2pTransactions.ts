import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getP2PTransactions(
  userId: string,
  page: number,
  limit: number
) {
  return prisma.p2PTransaction.findMany({
    where: {
      OR: [{ userid: userId }, { p2p_buyer: { userid: userId } }],
    },
    include: {
      p2p_buyer: true,
    },
    orderBy: { id: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });
}

export async function getP2PTransactionsCount(userId: string) {
  return prisma.p2PTransaction.count({
    where: {
      OR: [{ userid: userId }, { p2p_buyer: { userid: userId } }],
    },
  });
}
