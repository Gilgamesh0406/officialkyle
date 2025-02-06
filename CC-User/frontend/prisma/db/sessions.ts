import { PrismaClient } from '@prisma/client';
import { generateHexCode, getDevice } from '@/lib/server/utils';
const prisma = new PrismaClient();

export const create_session = async (userid: string, activated: boolean) => {
  const session = generateHexCode(32);
  const expire = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  const newSession = await prisma.userSession.create({
    data: {
      userid: userid,
      activated: activated,
      session: session,
      device: getDevice(),
      expire: expire,
      created: Math.floor(Date.now() / 1000),
    },
  });

  return newSession;
};

export const get_session = async (userid: string) => {
  const existingSession = await prisma.userSession.findFirst({
    where: {
      userid: userid,
      device: getDevice(),
      removed: false,
      expire: { gt: Math.floor(Date.now() / 1000) },
    },
    include: {
      user_logins: {
        orderBy: { time: 'desc' },
        take: 1,
      },
    },
    orderBy: { id: 'desc' },
  });

  return existingSession;
};

export const get_sessions_by_userid = async (userid: string) => {
  const existingSession = await prisma.userSession.findMany({
    where: {
      userid: userid,
      removed: false,
      expire: { gt: Math.floor(Date.now() / 1000) },
    },
    orderBy: { id: 'desc' },
  });
  return existingSession;
};

export const deactivate_session_by_id = async (sessionid: bigint) => {
  await prisma.userSession.update({
    where: { id: sessionid },
    data: { activated: false },
  });
};

export const activate_sessions_by_userid = async (userid: string) => {
  const updatedSession = await prisma.userSession.updateMany({
    where: {
      userid: userid,
      removed: false,
      activated: false,
      expire: { gt: Math.floor(Date.now() / 1000) },
    },
    data: { activated: true },
  });

  return updatedSession;
};
