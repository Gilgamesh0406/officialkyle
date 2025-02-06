import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCasebattleHistory() {
  return await prisma.casebattleGame.findMany({
    where: { ended: true },
    orderBy: { id: 'desc' },
    take: 50,
    include: {
      casebattle_rolls: {
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
