import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  // Process the webhook data (e.g., update deposit status)
  if (data && data.status === 'success') {
    // Update deposit in database
    const { depositId, amount, currency } = data;
    return NextResponse.json({ message: 'Deposit processed successfully' }, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid or failed deposit' }, { status: 400 });
}
