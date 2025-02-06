const { Op } = require("sequelize");

const Users = require("../models/Users");
const UserRestrictions = require("../models/UserRestrictions");
const UserSessions = require("../models/UserSessions");

const { getMessages, ignoreList } = require("./chatService");
const { getBets } = require("./coinflipService");
const { plinkoGames } = require("./plinkoService");
const { lastWinnings, getCases, getHistory } = require("./unboxingService");
const { getGameStats, getCaseBattleBets } = require("./caseBattleService");
const {
  getSiteAlerts,
  getSiteNotifies,
  calculateLevel,
  getTimeString,
} = require("../utils/helpers");

const config = require("../config");
const { time } = require("steam-totp");
const Setting = require("../models/Setting");

const getUserBySession = async (session) => {
  try {
    const userSession = await UserSessions.findOne({
      where: {
        session: session,
        removed: false,
        activated: true,
        expire: { [Op.gt]: parseInt(new Date().getTime() / 1000) },
      },
    });

    if (!userSession) {
      return null;
    }

    const user = await Users.findOne({
      where: {
        userid: userSession.userid,
      },
    });

    const userRestrictions = await UserRestrictions.findAll({
      where: {
        userid: userSession.userid,
        removed: false,
        expire: {
          [Op.or]: {
            [Op.gt]: parseInt(Date.now() / 1000),
            [Op.eq]: -1,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      bot: 0,
      userid: user.userid,
      name: user.anonymous ? "[anonymous]" : user.name,
      avatar: user.anonymous ? "default_avatar_url" : user.avatar,
      balance: parseFloat(user.balance).toFixed(2),
      rank: user.rank,
      xp: user.xp,
      tradelink: user.tradelink,
      apikey: user.apikey,
      initialized: user.initialized,
      verified: user.verified,
      email: user.email,
      available: parseFloat(user.available).toFixed(2),
      settings: {
        anonymous: user.anonymous,
        private: user.private,
      },
      restrictions: {
        play: 0,
        trade: 0,
        site: 0,
        mute:
          userRestrictions.find(
            (restriction) => restriction.restriction === "mute"
          )?.expire || 0,
        ban:
          userRestrictions.find(
            (restriction) => restriction.restriction === "ban"
          )?.expire || 0,
      },
      exclusion: user.exclusion,
      deposit: {
        count: user.deposit_count,
        total: user.deposit_total,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error("Unable to get user by session");
  }
};

const getInitialData = async (user, channel) => {
  const chatMessages = getMessages();
  // const user_chatMessages = chatMessages.filter(message => message.channel === channel || message.type === 'system');
  const user_chatMessages = chatMessages;

  if (config.chat.greeting.active) {
    user_chatMessages.push({
      type: "system",
      message: config.chat.greeting.message,
      time: new Date().getTime(),
    });
  }

  const userCommands = [];
  const commandsRank = config.chat.commandsRank;
  const commandsList = config.chat.commandsList;

  commandsRank[user.rank].forEach(function (item) {
    if (commandsList[item] === "userid" || commandsList[item] === "id") {
      userCommands.push({
        name: item,
        type: commandsList[item],
      });
    }
  });

  const gamesIntervalAmounts = {};
  Object.keys(config.settings.games.enable).forEach((item) => {
    if (config.rewards.interval_amount[item] !== undefined) {
      gamesIntervalAmounts[item] = config.rewards.interval_amount[item];
    }
  });
  const siteSettings = await Setting.findAll();
  gamesIntervalAmounts["send_coins"] =
    config.rewards.interval_amount["send_coins"];

  return {
    type: "first",
    maintenance: false,
    alerts: getSiteAlerts(),
    notifies: getSiteNotifies(),
    amounts: gamesIntervalAmounts,
    user: {
      userid: user.userid,
      name: user.name,
      balance: user.balance,
      rank: user.rank,
      settings: user.settings,
      siteSettings,
      level: calculateLevel(user.xp),
    },
    chat: {
      messages: user_chatMessages,
      commands: userCommands,
      listignore: ignoreList[user.userid] || [],
    },
    offers: {
      p2p_pendings: [],
      steam_pendings: [],
    },
    coinflip: {
      bets: getBets(),
    },
    plinko: {
      history: plinkoGames,
    },
    unboxing: {
      cases: getCases(),
      history: getHistory(),
    },
    casebattle: {
      bets: getCaseBattleBets(),
      stats: getGameStats(),
    },
  };
};

const getGuestInitialData = (channel) => {
  const chatMessages = getMessages();
  // const user_chatMessages = chatMessages.filter(message => message.channel === channel || message.type === 'system');
  const user_chatMessages = chatMessages;

  if (config.chat.greeting.active) {
    user_chatMessages.push({
      type: "system",
      message: config.chat.greeting.message,
      time: new Date().getTime(),
    });
  }

  const gamesIntervalAmounts = {};
  Object.keys(config.settings.games.enable).forEach((item) => {
    if (config.rewards.interval_amount[item] !== undefined) {
      gamesIntervalAmounts[item] = config.rewards.interval_amount[item];
    }
  });
  gamesIntervalAmounts["send_coins"] =
    config.rewards.interval_amount["send_coins"];

  return {
    type: "first",
    maintenance: false,
    alerts: getSiteAlerts(),
    notifies: getSiteNotifies(),
    amounts: gamesIntervalAmounts,
    user: undefined,
    chat: {
      messages: user_chatMessages,
      commands: [],
      listignore: [],
    },
    offers: {
      p2p_pendings: [],
      steam_pendings: [],
    },
    coinflip: {
      bets: getBets(),
    },
    plinko: {
      history: plinkoGames,
    },
    unboxing: {
      cases: getCases(),
      history: getHistory(),
    },
    casebattle: {
      bets: getCaseBattleBets(),
      stats: getGameStats(),
    },
  };
};

module.exports = {
  getUserBySession,
  getInitialData,
  getGuestInitialData,
};
