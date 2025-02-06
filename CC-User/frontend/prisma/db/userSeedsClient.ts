import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserSeedClient(userid: string) {
  return await prisma.userSeedClient.findFirst({
    where: { userid, removed: false },
    orderBy: { id: 'desc' },
    select: { seed: true },
  });
}
