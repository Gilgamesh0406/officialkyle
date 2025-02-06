import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserTransfers(
  userId: string,
  page: number,
  limit: number
) {
  return prisma.userTransfer.findMany({
    where: {
      OR: [{ from_userid: userId }, { to_userid: userId }],
    },
    orderBy: { id: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });
}

export async function getUserTransfersCount(userId: string) {
  return prisma.userTransfer.count({
    where: {
      OR: [{ from_userid: userId }, { to_userid: userId }],
    },
  });
}
