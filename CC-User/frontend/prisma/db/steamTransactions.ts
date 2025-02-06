import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getSteamTransactions(
  userId: string,
  page: number,
  limit: number
) {
  return prisma.steamTransaction.findMany({
    where: { userid: userId },
    orderBy: { id: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });
}

export async function getSteamTransactionsCount(userId: string) {
  return prisma.steamTransaction.count({
    where: { userid: userId },
  });
}
