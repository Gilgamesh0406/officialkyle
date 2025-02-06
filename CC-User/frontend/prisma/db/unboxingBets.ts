import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUnboxingHistory(userid: string) {
  return await prisma.unboxingBet.findMany({
    where: { userid },
    orderBy: { id: 'desc' },
    take: 50,
    include: {
      users_seeds_server: true,
      users_seeds_client: true,
    },
  });
}
