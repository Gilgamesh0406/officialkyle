import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserWinnings(userId: string) {
  return prisma.userTransaction.aggregate({
    where: {
      userid: userId,
      amount: { gt: 0 },
    },
    _sum: { amount: true },
  });
}

export async function getUserBets(userId: string) {
  return prisma.userTransaction.aggregate({
    where: {
      userid: userId,
      amount: { lt: 0 },
    },
    _sum: { amount: true },
  });
}

export async function getUserTransactions(
  userId: string,
  page: number,
  limit: number
) {
  return prisma.userTransaction.findMany({
    where: { userid: userId },
    orderBy: { id: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });
}

export async function getUserTransactionsCount(userId: string) {
  return prisma.userTransaction.count({
    where: { userid: userId },
  });
}
