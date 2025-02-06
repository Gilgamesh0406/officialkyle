import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCryptoTransactions(
  userId: string,
  page: number,
  limit: number
) {
  return prisma.cryptoTransaction.findMany({
    where: { userid: userId },
    orderBy: { id: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });
}

export async function getCryptoTransactionsCount(userId: string) {
  return prisma.cryptoTransaction.count({
    where: { userid: userId },
  });
}
