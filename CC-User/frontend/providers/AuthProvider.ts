import { TokenSet } from 'openid-client';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest } from 'next';

export const SteamAuthProvider = (req: NextApiRequest) => ({
  id: 'steam',
  name: 'Steam',
  type: 'oauth',
  authorization: {
    url: 'https://steamcommunity.com/openid/login',
    params: {
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': process.env.STEAM_REDIRECT_URL,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    },
  },
  token: {
    async request() {
      if (!req.url) {
        console.error('Token request error: req.url is undefined');
        return { tokens: new TokenSet({}) };
      }

      const url = new URL(req.url);
      const searchParams = new URLSearchParams(url.search);

      const signed = searchParams.get('openid.signed');
      const openid_claimedid = searchParams.get('openid.claimed_id');

      if (!signed || !openid_claimedid) {
        console.error('Token request error: Missing signed or claimed_id');
        return { tokens: new TokenSet({}) };
      }

      const tokenParams = {
        'openid.assoc_handle': searchParams.get('openid.assoc_handle'),
        'openid.signed': signed,
        'openid.sig': searchParams.get('openid.sig'),
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'check_authentication',
      };

      signed.split(',').forEach((key) => {
        tokenParams[`openid.${key}`] = searchParams.get(`openid.${key}`);
      });

      const tokenRes = await fetch('https://steamcommunity.com/openid/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenParams).toString(),
      });

      const result = await tokenRes.text();

      if (/is_valid\s*:\s*true/i.test(result)) {
        const matches = openid_claimedid.match(
          /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/
        );
        if (!matches) {
          console.error('Invalid SteamID format in claimed_id');
          return { tokens: new TokenSet({}) };
        }

        const steamid = matches[1];
        return {
          tokens: new TokenSet({
            id_token: uuidv4(),
            access_token: uuidv4(),
            steamid,
          }),
        };
      }

      console.error('Steam OpenID validation failed');
      return { tokens: new TokenSet({}) };
    },
  },
  userinfo: {
    async request(ctx: any) {
      try {
        const response = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${ctx.tokens.steamid}`
        );

        if (!response.ok) {
          console.error('Failed to fetch user info:', response.statusText);
          return {
            id: 'unknown',
            name: 'Unknown User',
            image: null,
          };
        }

        const data = await response.json();
        const player = data.response?.players?.[0];
        if (!player) {
          console.error('Invalid user data from Steam API');
          return {
            id: 'unknown',
            name: 'Unknown User',
            image: null,
          };
        }

        return player;
      } catch (err) {
        console.error('Error fetching user info:', err);
        return {
          id: 'unknown',
          name: 'Unknown User',
          image: null,
        };
      }
    },
  },
  profile(profile) {
    if (!profile.steamid || !profile.personaname || !profile.avatarfull) {
      console.error('Invalid Steam profile:', profile);
      return null;
    }

    return {
      id: profile.steamid,
      name: profile.personaname,
      image: profile.avatarfull,
    };
  },
  clientId: process.env.STEAM_CLIENT_ID,
  clientSecret: process.env.STEAM_API_KEY,
  idToken: false,
  checks: ['none'],
});
