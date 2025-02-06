import { PrismaClient } from '@prisma/client';
import { generateHexCode } from '@/lib/server/utils';

const prisma = new PrismaClient();

export const get_security_code = async (userid: string) => {
  const existingSecurityCode = await prisma.securityCode.findFirst({
    where: {
      type: 'login',
      userid: userid,
      used: 0,
      removed: false,
      OR: [{ expire: { gt: Math.floor(Date.now() / 1000) } }, { expire: -1 }],
    },
  });
  return existingSecurityCode;
};

export const create_new_security_code = async (userid: string) => {
  const securityCode = generateHexCode(6);

  const newSecurityCode = await prisma.securityCode.create({
    data: {
      type: 'login',
      userid: userid,
      code: securityCode,
      expire: Math.floor(Date.now() / 1000) + 300, // 5 minutes expiry
      created: Math.floor(Date.now() / 1000),
    },
  });

  return newSecurityCode;
};
