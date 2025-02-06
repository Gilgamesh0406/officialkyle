import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();

  // Rebuild the parameters for Steam verification
  searchParams.forEach((value, key) => {
    if (key.startsWith('openid.')) {
      params.append(key, value);
    }
  });
  params.append('openid.mode', 'check_authentication');

  // Verify the Steam login with a POST request
  const response = await fetch('https://steamcommunity.com/openid/login', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const responseBody = await response.text();

  if (responseBody.includes('is_valid:true')) {
    // Extract the Steam ID from the claimed ID
    const steamID = searchParams
      .get('openid.claimed_id')
      ?.split('/')
      .pop();

    // Set the cookie
    const res = NextResponse.redirect('http://localhost:3000/'); // Use absolute URL here
    res.cookies.set('steamID', steamID || '', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } else {
    return NextResponse.json({ success: false, error: 'Steam authentication failed' });
  }
}
