import NextAuth from 'next-auth/next';
import { NextApiRequest } from 'next';
import {
  SteamAuthProvider,
  // CustomAuthProvider,
} from '@/providers/AuthProvider';
import { cookies } from 'next/headers';
import { getSteamLevel, get_auth_session } from '@/lib/server/auth';
import { getOrCreateUserSteamID, getUserByEmail } from '@/prisma/db/users';

const handler = async (
  req: NextApiRequest,
  ctx: { params: { nextauth: string[] } }
) => {
  //@ts-ignore
  return await NextAuth(req, ctx, {
    // Configure one or more authentication providers
    providers: [
      // CustomAuthProvider(),
      SteamAuthProvider(req)
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        // Get or create user, use steamid for email
        if (profile) {
          const prof: any = profile;
          console.log('[NextAuth] Steam signin profile: ', prof);

          if (prof.steamid && prof.personaname && prof.avatar) {
            const level = await getSteamLevel(prof.steamid);
            // limit by steam level will be implemented here
            // when creating or getting user, will update a certain user's field to true or false so that he can't play games
            console.log('STEAM ACCOUNT LEVEL', level);
            await getOrCreateUserSteamID(
              prof.steamid,
              prof.personaname,
              prof.avatar
            );
          } else {
            // profile error.
            console.log('[NextAuth] Steam signin error: ', prof);
            return false;
          }
        }
        return true;
      },
      async redirect({ url, baseUrl }) {
        console.log("[baseUrl]",baseUrl)
        return baseUrl;
      },
      async session({ session, token, user }) {
        let email = session.user?.email;
        if (!email) {
          // get sub from token, as it is steamid stored as email
          email = token.sub;
        }
        if (!email) {
          return null;
        }
        const { error, _session, expire } = await get_auth_session(email);
        // if (!session.user || !session.user?.email) {
        //   console.log(
        //     '[NextAuth] Session Callback: ',
        //     'No Email found in the session.',
        //     session
        //   );
        //   return null;
        // }
        if (error || !_session || !expire) {
          console.log(
            '[NextAuth] Session Callback(get_auth_session): ',
            error,
            session
          );
          return session;
        }
        // console.log("[API] Session: ", session, _session)
        cookies().set('session', _session, {
          expires: new Date(Number(expire) * 1000),
        });
        const user_rec = await getUserByEmail(email);
        if (user_rec?.userid) {
          cookies().set('userid', user_rec?.userid);
          cookies().set('email', email);
        }
        return session;
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        return token;
      },
    },
  });
};

export { handler as GET, handler as POST };