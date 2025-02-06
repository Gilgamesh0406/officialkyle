import { generateHexCode } from '@/lib/server/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

//
export const getUserByEmailAndPassword = async (
  email: string | undefined,
  password: string | undefined
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      // password: password
    },
  });
  if (!user) {
    return;
  }
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return;
  }
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { userid: id },
  });

  return user;
};

export const getOrCreateUserSteamID = async (
  steamid: string,
  username: string,
  avatar: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: steamid,
    },
  });
  if (!user) {
    const user = await prisma.user.create({
      data: {
        email: steamid,
        userid: generateHexCode(24),
        username: username,
        name: username,
        avatar: avatar,
        time_create: BigInt(Math.floor(Date.now() / 1000)),
        initialized: true,
      },
    });
    // create user seed
    await prisma.userSeedClient.create({
      data: {
        seed: generateHexCode(32),
        time: BigInt(Math.floor(Date.now() / 1000)),
        userid: user.userid,
      },
    });
    await prisma.userSeedServer.create({
      data: {
        seed: generateHexCode(32),
        userid: user.userid,
        time: BigInt(Math.floor(Date.now() / 1000)),
      },
    });
  }
};