import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const steamId = req.cookies.get('steamId')?.value || null;
  return NextResponse.json({ steamId });
}
