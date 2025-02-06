import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTwoFA = async (userid: string) => {
  const userTwoFA = await prisma.userTwofa.findFirst({
    where: {
      userid: userid,
      removed: false,
      activated: true,
    },
  });
  return userTwoFA;
};
