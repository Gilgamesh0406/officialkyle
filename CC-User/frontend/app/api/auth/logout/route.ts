import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  cookies().delete('steamID');
  return NextResponse.redirect('http://localhost:3000/');
}
