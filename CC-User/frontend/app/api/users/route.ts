import { NextResponse } from 'next/server';

import { getUsers } from '@/prisma/db/users';
import { serializeData } from '@/lib/server/utils';
const handler = async () => {
  try {
    const users = await getUsers();
    return NextResponse.json({
      users: serializeData(users),
    });
    // return NextResponse.json(serializeData(users))
  } catch (error) {
    console.log('[API]', error);
  }
};

export { handler as GET };
