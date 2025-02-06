import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserSeedServer(userid: string) {
  return await prisma.userSeedServer.findMany({
    where: { userid },
    orderBy: { id: 'desc' },
    take: 50,
  });
}
