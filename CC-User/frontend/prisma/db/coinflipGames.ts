import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCoinflipHistory() {
  return await prisma.coinflipGame.findMany({
    where: { ended: true },
    orderBy: { id: 'desc' },
    take: 50,
    include: {
      coinflip_rolls: {
        where: { removed: false },
        select: {
          public_seed: true,
          blockid: true,
          roll: true,
        },
      },
    },
  });
}
