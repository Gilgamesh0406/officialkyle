import { NextResponse } from 'next/server';

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

export async function GET() {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/steam/callback`,
    'openid.realm': `${process.env.NEXT_PUBLIC_APP_URL}`,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  // Redirect user to Steam OpenID
  return NextResponse.redirect(`${STEAM_OPENID_URL}?${params.toString()}`);
}
