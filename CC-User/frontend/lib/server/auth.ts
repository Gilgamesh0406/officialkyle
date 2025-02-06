import { create_session, get_session } from '@/prisma/db/sessions';
import { getTwoFA } from '@/prisma/db/twofa';
import { getUserByEmail, getUserById } from '@/prisma/db/users';
import { create_login_record } from '@/prisma/db/userLogins';
interface SessionData {
  userid: string;
  type: string;
}

export const authCheckSession = async (data: SessionData) => {
  try {
    // const user = getUserById(data.userid);
    //@ts-ignore
    // if (!user || !user.initialized || !user.verified) {
    //   const userTwoFA = await getTwoFA(data.userid);
    //   if (!userTwoFA) {
    //     const updatedSession = await activate_sessions_by_userid(data.userid);
    //     if (updatedSession.count === 0) {
    //       return {
    //         error: 'Session update failed.'
    //       };
    //     }
    //   }
    // }

    const existingSession = await get_session(data.userid);
    if (!existingSession) {
      return authInsertSession(data);
    }

    const { session, expire, id: sessionid } = existingSession;
    const userLogin = await create_login_record(
      data.type,
      data.userid,
      sessionid
    );

    if (!userLogin) {
      return {
        error: 'Session creation failed.',
      };
    }
    return { session, expire };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const authInsertSession = async (data: SessionData) => {
  try {
    const user = await getUserById(data.userid);

    if (!user) {
      return {
        error: 'Session registered unsuccessfully (1)',
      };
    }

    let activated = true;

    if (user.initialized && user.verified) {
      activated = false;
    }

    const twoFA = await getTwoFA(data.userid);

    if (twoFA) {
      activated = false;
    }

    const newSession = await create_session(data.userid, activated);

    const userLogin = await create_login_record(
      data.type,
      data.userid,
      newSession.id
    );

    if (!userLogin) {
      return {
        error: 'Session registered unsuccessfully (4)',
      };
    }
    return { session: newSession.session, expire: newSession.expire };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const get_auth_session = async (email: string | undefined | null) => {
  if (email === undefined || email === null) {
    return {
      error: 'No email found in the requested session.',
    };
  }
  const user = await getUserByEmail(email);
  if (!user) {
    return {
      error: 'No user found',
    };
  }
  const { error, session, expire } = await authCheckSession({
    userid: user.userid,
    type: 'auth_login',
  });
  return {
    error,
    _session: session,
    expire,
  };
};

export const getSteamLevel = async (steamid: string) => {
  const url = `http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamid}`;
  const response = await fetch(url);
  const data = await response.json();
  // console.log("[STEAM USER LEVEL]",data);
  const level = data.response.player_level;
  return level;
};
