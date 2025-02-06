import { PrismaClient } from '@prisma/client';
import { getUserAgent, getUserIp, getUserLocation } from '@/lib/server/utils';

const prisma = new PrismaClient();

export const create_login_record = async (
  type: string,
  userid: string,
  sessionid: bigint
) => {
  const userLogin = await prisma.userLogin.create({
    data: {
      type: type,
      userid: userid,
      sessionid: sessionid,
      ip: getUserIp(),
      agent: getUserAgent(),
      location: getUserLocation(getUserIp()),
      time: Math.floor(Date.now() / 1000),
    },
  });

  return userLogin;
};
