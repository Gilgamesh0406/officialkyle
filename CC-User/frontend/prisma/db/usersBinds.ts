import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserBinds(userId: string) {
  return prisma.userBind.findMany({
    where: {
      userid: userId,
      removed: false,
    },
    select: {
      bind: true,
      bindid: true,
    },
  });
}
