import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/prisma/db/users';
import { getTwoFA } from '@/prisma/db/twofa';

const handler = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get('userid')?.value;
  if (!userId) {
    return NextResponse.json({
      error: 'Please log in.',
    });
  }

  const user = await getUserById(userId);
  const twofa = await getTwoFA(userId);
  if (!user) {
    // return res.status(404).json({ error: 'User not found' });
    return NextResponse.json({ error: 'User not found' });
  }

  // User stats
  const res = {
    registrationDate: new Date(Number(user.time_create) * 1000).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    ),
    availableBalance: Number(user.balance),
    availableWithdraw: Number(user.available),
    isVerified: user.verified,
    anonymouse: user.anonymous,
    privateMode: user.private,
    isTwoFactorEnabled: !!twofa,
    sounds: false,
  };
  return NextResponse.json({
    ...res,
  });
};

export { handler as GET };
