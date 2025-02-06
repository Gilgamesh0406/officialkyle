const { Op } = require("sequelize");
const ChatMessage = require("../models/ChatMessage");
const ChatIgnore = require("../models/ChatIgnore");
const Users = require("../models/Users");
const UserRestrictions = require("../models/UserRestrictions");

const {
  calculateLevel,
  makeDate,
  time,
  getTimeString,
  getFormatSeconds,
} = require("../utils/helpers");

const config = require("../config");
const { rainGame, tipGame, rollGame } = require("./rainService");
const RainHistory = require("../models/RainHistory");

let chatMessages = [];
let ignoreList = {};
let chatMode = "normal";
let userLastMessage = {};

const commandsList = {
  ignore: "userid",
  unignore: "userid",
  ignorelist: "none",
  mute: "userid",
  unmute: "userid",
  deletemessage: "id",
  cleanchat: "none",
  chatmode: "none",
  tiprain: "none",
  lastrain: "none",
  rollrain: "none",
  online: "none",
  ban: "userid",
  unban: "userid",
};

const commandsRank = {
  0: [
    "ignore",
    "mute",
    "unmute",
    "unignore",
    "ignorelist",
    "tiprain",
    "lastrain",
    "ban",
    "unban",
  ],
  1: [
    "ignore",

    "unignore",
    "ignorelist",
    "mute",
    "unmute",
    "deletemessage",
    "cleanchat",
    "chatmode",
    "tiprain",
    "lastrain",
    "rollrain",
    "online",
    "ban",
    "unban",
  ],
  2: [
    "ignore",

    "unignore",
    "ignorelist",
    "mute",
    "deletemessage",
    "cleanchat",
    "chatmode",
    "tiprain",
    "lastrain",
    "rollrain",
    "online",
    "ban",
    "unban",
  ],
  3: [
    "ignore",
    "unignore",
    "ignorelist",
    "tiprain",
    "lastrain",
    "ban",
    "unban",
  ],
  4: [
    "ignore",
    "unignore",
    "ignorelist",
    "tiprain",
    "lastrain",
    "ban",
    "unban",
  ],

  5: [
    "ignore",
    "unignore",
    "ignorelist",
    "tiprain",
    "lastrain",
    "ban",
    "unban",
  ],
  6: [
    "ignore",
    "unignore",
    "ignorelist",
    "tiprain",
    "lastrain",
    "ban",
    "unban",
  ],
  7: [
    "ignore",
    "unignore",
    "ignorelist",
    "tiprain",
    "lastrain",
    "ban",
    "unban",
  ],
  8: [
    "ignore",
    "unignore",
    "ignorelist",
    "mute",
    "unmute",

    "deletemessage",
    "cleanchat",
    "chatmode",
    "tiprain",
    "lastrain",
    "rollrain",
    "online",
    "ban",
    "unban",
  ],
  34: [
    "ignore",

    "unignore",
    "ignorelist",
    "mute",
    "unmute",
    "deletemessage",
    "cleanchat",
    "chatmode",
    "tiprain",
    "lastrain",
    "rollrain",
    "online",
    "ban",
    "unban",
  ],
  100: [
    "ignore",

    "unignore",
    "ignorelist",
    "mute",
    "unmute",
    "deletemessage",
    "cleanchat",
    "chatmode",
    "tiprain",
    "lastrain",
    "rollrain",
    "online",
    "ban",
    "unban",
  ],
};

const ranksList = [
  { rank: "player", code: 0 },
  { rank: "admin", code: 1 },
  { rank: "moderator", code: 2 },
  { rank: "helper", code: 3 },
  { rank: "veteran", code: 4 },
  { rank: "pro", code: 5 },
  { rank: "youtuber", code: 6 },
  { rank: "streamer", code: 7 },
  { rank: "developer", code: 8 },
  { rank: "owner", code: 100 },
];

const loadMessages = async () => {
  console.log("[CHAT] Loading Messages");
  try {
    const messages = await ChatMessage.findAll({
      where: {
        deleted: 0,
      },
      order: [["id", "DESC"]],
      limit: config.chat.max_messages,
    });

    chatMessages = await Promise.all(
      messages.reverse().map(async (message) => {
        const mentions = await getMentions(message.message);
        return {
          type: "player",
          id: message.id,
          user: {
            userid: message.userid,
            name: message.name,
            avatar: message.avatar,
            rank: message.rank,
            level: calculateLevel(message.xp).level,
          },
          rank: message.rank,
          private: message.private,
          message: message.message,
          channel: message.channel,
          mentions: mentions,
          time: message.time,
        };
      })
    );
  } catch (error) {
    console.error("Error loading chat messages : ", error);
  }
};

const checkMessage = async (user, io, socket, message, channel) => {
  console.log("[CHAT] Check Message");
  if (message.trim().length <= 0) {
    socket.emit("message", {
      type: "error",
      error: "Error : Message is Empty!",
    });
  }

  let res = null;
  let textMessage = "";

  if ((res = /^\/help ([a-zA-Z0-9 ]*)/.exec(message))) {
    if (!checkCommand(res[1], user.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    }

    if (res[1] == "mute") {
      textMessage =
        "By using this command you can mute the people that infringe the rules of chat! If you mute innocent people you can lose this rank.";
      textMessage +=
        "<br><br>Type /mute [user id] [time] [reason]<br><br>For exemple [time] can be [amount][minutes/hours/days/months/years] or [permanent].";
    } else if (res[1] == "unmute") {
      textMessage =
        "By using this command you can unmute innocent people who have received the mute! If you unmute guilty people you can lose this rank.";
      textMessage += "<br><br>Type /unmute [user id]";
    } else if (res[1] == "deletemessage") {
      textMessage =
        "By using this command you can delete messages that are spammed or contain mistakes or others!";
      textMessage += "<br><br>Type /deletemessage [message id]";
    } else if (res[1] == "cleanchat") {
      textMessage = "By using this command you can clean the chat to be fresh!";
      textMessage += "<br><br>Type /cleanchat";
    } else if (res[1] == "ignorelist") {
      textMessage =
        "By using this command you can view the list who contail all players ignored!";
      textMessage += "<br><br>Type /ignorelist";
    } else if (res[1] == "ignore") {
      textMessage =
        "By using this command you can ignore the player who has annoyed you or who is spamming you or something else!";
      textMessage += "<br><br>Type /ignore [user id]";
    } else if (res[1] == "unignore") {
      textMessage =
        "By using this command you can unignore the player who is ignored!";
      textMessage += "<br><br>Type /unignore [user id]";
    } else if (res[1] == "chatmode") {
      textMessage =
        "By using this command you can change the chat mode to be a chat who contain spam or a chat who is stopped or a normal chat!";
      textMessage += "<br><br>Type /chatmode [normal / fast / pause]";
    } else if (res[1] == "tiprain") {
      textMessage = "By using this command you can tip coins to rain!";
      textMessage += "<br><br>Type /tiprain [amount]";
    } else if (res[1] == "lastrain") {
      textMessage = "By using this command you can see when was the last rain!";
      textMessage += "<br><br>Type /lastrain";
    } else if (res[1] == "rollrain") {
      textMessage =
        "By using this command you can roll the rain faster than it should have been!";
      textMessage += "<br><br>Type /rollrain";
    } else if (res[1] == "online") {
      textMessage = "By using this command you can see the online players!";
      textMessage += "<br><br>Type /online";
    } else if (res[1] == "ban") {
      textMessage = "By using this command you can ban a player!";
      textMessage += "<br><br>Type /ban [user id] [time]";
    } else if (res[1] == "unban") {
      textMessage = "By using this command you can unban a player!";
      textMessage += "<br><br>Type /unban [user id]";
    }

    otherMessages(textMessage, socket, false);
  } else if ((res = /^\/help/.exec(message))) {
    let textMessage = "Available commands: ";

    commandsRank[user.rank].forEach((item, index) => {
      textMessage += "/" + item;

      if (index < commandsRank[user.rank].length - 1) textMessage += ", ";
      else textMessage += ".";
    });

    textMessage +=
      "<br><br>If you need help for a command please send /help [command] (Ex: /help ignore).";

    otherMessages(textMessage, socket, false);
  } else if (
    (res = /^\/mute ([a-z0-9_]*) ([a-zA-Z0-9]*) ([a-zA-Z0-9 ]*)/.exec(message))
  ) {
    if (!checkCommand("mute", user?.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      const restriction = await setRestriction(
        io,
        user,
        {
          userid: res[1],
          restriction: "mute",
          time: res[2],
          reason: res[3],
        },
        true
      );

      if (restriction.type && restriction.type == "error") {
        socket.emit("message", {
          type: "error",
          error: restriction.message,
        });
      } else {
        socket.emit("message", {
          type: "success",
          success: restriction.message,
        });
      }
    }
  } else if ((res = /^\/unmute ([a-z0-9_]*) ([a-zA-Z0-9 ]*)/.exec(message))) {
    console.log("[checkCommand]", checkCommand("unmute", user?.rank));
    if (!checkCommand("unmute", user?.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    }

    const unSet = unsetRestriction(io, {
      userid: res[1],
      byuserid: res[2],
      restriction: "mute",
    });

    if (unSet.type && unSet.type == "error") {
      socket.emit("message", {
        type: "error",
        error: unSet.message,
      });
    } else {
      socket.emit("message", {
        type: "success",
        success: "The user was successfully unrestricted!",
      });
    }
  } else if (
    (res = /^\/ban ([a-z0-9_]*) ([a-zA-Z0-9]*) ([a-zA-Z0-9 ]*)/.exec(message))
  ) {
    console.log("[ban]", res);
    if (!user) {
      return;
    }

    if (!checkCommand("ban", user.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    }

    const restriction = await setRestriction(
      io,
      user,
      {
        userid: res[1],
        restriction: "ban",
        time: res[2],
        reason: res[3],
      },
      true
    );
    console.log("[ban]", restriction);

    if (restriction && restriction.type && restriction.type == "error") {
      socket.emit("message", {
        type: "error",
        error: restriction.message,
      });
    } else {
      socket.emit("message", {
        type: "success",
        success: restriction.message,
      });
    }
  } else if ((res = /^\/unban ([a-z0-9_]*) ([a-z0-9_]*)/.exec(message))) {
    console.log("[unban]", res);
    if (!user) {
      return;
    }

    if (!checkCommand("unban", user.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    }

    const unSet = unsetRestriction(io, {
      userid: res[1],
      byuserid: res[2],
      restriction: "ban",
    });

    if (unSet.type && unSet.type == "error") {
      socket.emit("message", {
        type: "error",
        error: unSet.message,
      });
    } else {
      socket.emit("message", {
        type: "success",
        success: "The user was successfully unrestricted!",
      });
    }
  } else if ((res = /^\/deletemessage ([0-9]*)/.exec(message))) {
    if (!checkCommand("deletemessage", user.rank)) {
      socket.emit("message", {
        type: "error",

        error: "Invalid command name provided!",
      });
    }

    if (isNaN(Number(res[1]))) {
      socket.emit("message", {
        type: "error",
        error: "Error: Invalid message id!",
      });
    }

    const messageId = res[1];
    const messageIndex = chatMessages.findIndex((item) => item.id == messageId);

    if (messageIndex == -1) {
      socket.emit("message", {
        type: "error",
        error: "Error: Unknown message id or already deleted!",
      });
    }

    await ChatMessage.update(
      { deleted: 1 },
      {
        where: {
          id: messageId,
        },
      }
    );

    chatMessages.splice(messageIndex, 1);

    io.sockets.emit("message", {
      type: "chat",
      command: "delete",
      id: messageId,
    });
  } else if ((res = /^\/cleanchat/.exec(message))) {
    if (!checkCommand("cleanchat", user.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    }

    if (chatMessages.length <= 0) {
      socket.emit("message", {
        type: "error",
        error: "Error: There are no messages!",
      });
    } else {
      chatMessages = [];

      io.sockets.emit("message", {
        type: "chat",
        command: "clean",
      });

      const textMessage = "Chat history has been wiped.";

      otherMessages(textMessage, io.sockets, false);
    }
  } else if ((res = /^\/ignorelist/.exec(message))) {
    if (!checkCommand("ignorelist", user.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      let textMessage = "";
      if (
        ignoreList[user.userid] === undefined ||
        ignoreList[user.userid].length <= 0
      ) {
        textMessage = "Your ignore list is empty.";
        otherMessages(textMessage, socket, false);
      } else {
        textMessage = "Ignored users: " + ignoreList[user.userid].join(", ");
        otherMessages(textMessage, socket, false);
      }
    }
  } else if ((res = /^\/ignore ([a-z0-9_]*)/.exec(message))) {
    if (!checkCommand("ignore", user.rank)) {
      return socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      const targetUserId = res[1];

      if (targetUserId == user.userid) {
        return socket.emit("message", {
          type: "error",
          error: "Error: You can't ignore yourself!",
        });
      }

      try {
        const ignoreUser = await Users.findOne({
          where: {
            userid: targetUserId,
          },
        });

        if (!ignoreUser) {
          return socket.emit("message", {
            type: "error",
            error: "Error: Unknown user!",
          });
        }

        const ignoreDetail = await ChatIgnore.findOne({
          where: {
            removed: 0,
            ignoreid: targetUserId,
          },
        });

        if (ignoreDetail) {
          return socket.emit("message", {
            type: "error",
            error: "Error: This user is already ignored!",
          });
        }

        await ChatIgnore.create({
          userid: user.userid,
          ignoreid: targetUserId,
          time: time(),
        });

        if (!ignoreList[user.userid]) ignoreList[user.userid] = [];

        ignoreList[user.userid].push(targetUserId);

        socket.emit("message", {
          type: "chat",
          command: "ignorelist",
          list: ignoreList[user.userid],
        });

        refreshMessages(socket);

        socket.emit("message", {
          type: "info",
          info: `User ${ignoreUser.name} successfully ignored!`,
        });
      } catch (error) {
        console.error("Error processing ignore command:", error);
        socket.emit("message", {
          type: "error",
          error: "Error: Something went wrong while processing the command.",
        });
      }
    }
  } else if ((res = /^\/unignore ([a-z0-9_]*)/.exec(message))) {
    if (!checkCommand("unignore", user.rank)) {
      return socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      const targetUserId = res[1];

      try {
        const ignoreUser = await Users.findOne({
          where: {
            userid: targetUserId,
          },
        });

        if (!ignoreUser) {
          return socket.emit("message", {
            type: "error",
            error: "Error: Unknown user!",
          });
        }

        const ignoreDetail = await ChatIgnore.findOne({
          where: {
            removed: 0,
            ignoreid: targetUserId,
          },
        });

        if (!ignoreDetail) {
          return socket.emit("message", {
            type: "error",
            error: "Error: This user is not ignored!",
          });
        }

        await ChatIgnore.update(
          { removed: 1 },
          {
            where: {
              userid: targetUserId,
            },
          }
        );

        const index = ignoreList[user.userid].indexOf(targetUserId);
        ignoreList[user.userid].splice(index, 1);

        socket.emit("message", {
          type: "chat",
          command: "ignorelist",
          list: ignoreList[user.userid],
        });

        refreshMessages(socket);

        socket.emit("message", {
          type: "info",
          info: `User ${ignoreUser.name} successfully unignored!`,
        });
      } catch (error) {
        console.error("Error processing ignore command:", error);
        socket.emit("message", {
          type: "error",
          error: "Error: Something went wrong while processing the command.",
        });
      }
    }
  } else if ((res = /^\/chatmode ([a-zA-Z0-9]*)/.exec(message))) {
    if (!checkCommand("chatmode", user.rank)) {
      return socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      const mode = res[1];

      if (mode !== "normal" && mode !== "fast" && mode !== "pause") {
        socket.emit("message", {
          type: "error",
          error: "Invalid chat mode!",
        });
      }

      chatMode = mode;

      const textMessage = `Chat has changed to ${mode} mode.`;
      otherMessages(textMessage, io.sockets, true);
    }
  } else if ((res = /^\/tiprain ([0-9.]*)/.exec(message))) {
    if (!checkCommand("tiprain", user.rank)) {
      return socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      tipGame(user, socket, res[1]);

      otherMessages(textMessage, io.sockets, false);
    }
  } else if ((res = /^\/lastrain/.exec(message))) {
    if (!checkCommand("lastrain", user.rank)) {
      return socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      const rainHistory = RainHistory.findAll({
        where: {
          ended: 1,
        },
        order: [["id", "DESC"]],
      });

      if (rainHistory) {
        const lastRain = getFormatSeconds(time() - rainHistory[0].time_roll);
        const textMessage = `Last rain was now ${lastRain.minutes} minutes and ${lastRain.seconds} seconds ago.`;

        otherMessages(textMessage, socket, false);
      } else {
        const textMessage = "This is first rain.";
        otherMessages(textMessage, socket, false);
      }
    }
  } else if ((res = /^\/rollrain/.exec(message))) {
    if (!checkCommand("lastrain", user.rank)) {
      return socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    } else {
      if (rainGame.status != "wait") {
        socket.emit("message", {
          type: "error",
          error: "Error: You can only roll the rain until starts!",
        });

        return;
      }

      rollGame(io);
    }
  } else if ((res = /^\/online/.exec(message))) {
    if (!checkCommand("online", user.rank)) {
      socket.emit("message", {
        type: "error",
        error: "Invalid command name provided!",
      });
    }

    // let list = Object.keys(usersOnline).map(key => userOnline[key].user);

    // socket.emit('message', {
    //     type: "list",
    //     list: list
    // });
  } else if ((res = /^\/([a-zA-Z0-9]*)/.exec(message))) {
    socket.emit("message", {
      type: "error",
      error: "Invalid command provided!",
    });
  } else {
    writeMessage(user, io, socket, message, channel);
  }
};

const writeMessage = async (user, io, socket, message, channel) => {
  // if(chatMode == 'pause' && !config.config_site.pause_excluded.includes(config.config_site.ranks_name[user.rank])) {
  // 	return cooldown(false, true);
  // }

  // if(chatMode == 'normal') if(chat_userLastMessage[user.userid] + config.config_chat.cooldown_massage > time()) {
  // 	return cooldown(false, true);
  // }
  console.log(user);
  if (!user || !user.userid) {
    console.error("Invalid user object:", user);
    return;
  }

  // Add check for banned users
  if (
    (user.restrictions.ban >= time() || user.restrictions.ban == -1) &&
    !config.site.ban_excluded.includes(config.site.ranks_name[user.rank])
  ) {
    socket.emit("message", {
      type: "error",
      error:
        "Error: You are banned from using chat. The ban expires " +
        (user.restrictions.ban == -1
          ? "never"
          : makeDate(new Date(user.restrictions.ban * 1000))) +
        ".",
    });
    return;
  }

  userLastMessage[user.userid] = time();
  message = safeMessage(message).trim();

  if (message.length <= 0) {
    socket.emit("message", {
      type: "error",
      error: "Error: You can't send a empty message.",
    });
    return;
  }

  if (message.length > 200) message = message.substr(0, 200);

  if (
    (user.restrictions.mute >= time() || user.restrictions.mute == -1) &&
    !config.site.mute_excluded.includes(config.site.ranks_name[user.rank])
  ) {
    socket.emit("message", {
      type: "error",
      error:
        "Error: You are restricted to use our chat. The restriction expires " +
        (user.restrictions.mute == -1
          ? "never"
          : makeDate(new Date(user.restrictions.mute * 1000))) +
        ".",
    });
    return;
  }

  if (!config.chat.channels.includes(channel)) {
    socket.emit("message", {
      type: "error",
      error: "Invalid channel!",
    });
    return;
  }

  const mentions = await getMentions(message);
  const timeNow = new Date().getTime();

  const newMessage = await ChatMessage.create({
    userid: user.userid,
    name: user.name,
    avatar: user.avatar,
    rank: parseInt(user.rank),
    xp: parseInt(user.xp),
    private: parseInt(user.settings["private"]),
    message: message,
    channel: channel,
    time: timeNow,
  });

  const formattedMsg = {
    type: "player",
    id: newMessage.id,
    user: {
      userid: user.userid,
      name: user.name,
      avatar: user.avatar,
      level: calculateLevel(user.xp).level,
    },
    rank: user.rank,
    private: user.settings["private"],
    message: message,
    channel: channel,
    mentions: mentions,
    time: timeNow,
  };

  io.sockets.emit("message", {
    type: "chat",
    command: "message",
    message: formattedMsg,
    added: true,
  });

  chatMessages.push(formattedMsg);

  while (chatMessages.length > config.chat.max_messages) chatMessages.shift();
};

const setRestriction = async (io, user, data, chat) => {
  const timeRestriction = getTimeString(data.time);
  console.log("[setRestriction]", timeRestriction);

  if (timeRestriction === 0)
    return {
      type: "error",
      message: "Invalid restriction time!",
    };

  const userData = await Users.findOne({
    // where: { userid: data.userid }
    where: { userid: data.userid },
  });

  if (!userData) {
    return {
      type: "error",
      message: "Unknown User!",
    };
  }

  const restriction = await UserRestrictions.findOne({
    where: {
      removed: 0,
      restriction: data.restriction,
      userid: data.userid,
      byuserid: user.userid,
    },
  });

  if (restriction)
    return {
      type: "error",
      message: "This user have already this restriction!",
    };

  await UserRestrictions.create({
    userid: data.userid,
    restriction: data.restriction,
    reason: data.reason,
    byuserid: user.userid,
    expire: timeRestriction,
    time: time(),
  });
  console.log("[setRestriction]", userData.name);

  if (chat) {
    const restrictionsMap = {
      play: "play banned",
      trade: "trade banned",
      site: "site banned",
      mute: "muted",
      ban: "banned",
    };

    const restrictionType = restrictionsMap[data.restriction];

    if (restrictionType) {
      const expires =
        timeRestriction === -1
          ? "never"
          : makeDate(new Date(timeRestriction * 1000));
      const textMessage = `${userData.name} was ${restrictionType} by ${user.name} for ${data.reason}. The restriction expires ${expires}.`;

      otherMessages(textMessage, io.sockets, true);

      return {
        type: "success",
        message: "The user was successfully restricted!",
      };
    }
  }
};

const unsetRestriction = async (io, data) => {
  const restriction = await UserRestrictions.findOne({
    where: {
      removed: 0,
      restriction: data.restriction,
      userid: data.userid,
      byuserid: data.byuserid,
      // [Op.or]: [
      // { expire: -1 },
      // { expire: { [Op.gt]: time() } }
      // ]
    },
  });

  if (!restriction)
    return {
      type: "error",
      message: "Error: This user don't have this restriction!",
    };

  const updatedRestriction = await UserRestrictions.update(
    { removed: 1 },
    {
      where: {
        removed: 0,
        restriction: data.restriction,
        userid: data.userid,
        byuserid: data.byuserid,
        // [Op.or]: [
        //     { expire: -1 },
        //     { expire: { [Op.gt]: time() } }
        // ]
      },
    }
  );

  if (updatedRestriction.length <= 0) {
    return {
      type: "error",
      message: "The user was unsuccessfully unrestricted!",
    };
  }

  const textMessage = `The user was successfully unrestricted!`;

  otherMessages(textMessage, io.sockets, true);
};

const refreshMessages = (socket) => {
  socket.emit("message", {
    type: "chat",
    command: "clean",
  });

  chatMessages.forEach((item) => {
    socket.emit("message", {
      type: "chat",
      command: "message",
      message: item,
      added: false,
    });
  });
};

const safeMessage = (message) => {
  const tagReplacement = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };

  return message.replace(/[&<>]/g, (tag) => tagReplacement[tag] || tag);
};

const otherMessages = (message, socket, keep) => {
  const newMessage = {
    type: "system",
    message: message,
    time: new Date().getTime(),
  };

  socket.emit("message", {
    type: "chat",
    command: "message",
    message: newMessage,
    added: false,
  });

  if (keep) {
    chatMessages.push(newMessage);
    while (chatMessages.length > config.chat.max_messages) chatMessages.shift();
  }
};

const getMentions = async (message) => {
  const reg = /\B@([a-f\d]+)/gi;

  const mentions = message.match(reg)?.map((m) => m.replace("@", "")) ?? [];

  if (mentions.length === 0) return [];

  const uniqueMentions = [...new Set(mentions)];

  const users = await Users.findAll({
    where: { userid: uniqueMentions },
  });

  return users.map((user) => ({
    mention: `@${user.userid}`,
    name: `@${user.name}`,
  }));
};

const checkCommand = (command, rank) => {
  if (commandsList[command] === undefined) return false;
  if (!commandsRank[rank]?.includes(command)) return false;

  return true;
};

const addMessage = async (user, messageText, channel) => {
  try {
    const newMessage = await ChatMessage.create({
      userid: user.userid,
      name: user.name,
      avatar: user.avatar,
      rank: user.rank,
      xp: user.xp,
      private: user.settings["private"],
      message: messageText,
      channel: channel,
      time: Date.now(),
    });

    const formattedMessage = {
      type: "player",
      id: newMessage.id,
      user: {
        userid: user.userid,
        name: user.name,
        avatar: user.avatar,
        level: calculateLevel(user.xp).level,
      },
      rank: user.rank,
      private: user.settings["private"],
      message: messageText,
      channel: channel,
      mentions: await getMentions(messageText),
      time: Date.now(),
    };

    chatMessages.push(formattedMessage);

    while (chatMessages.length > config.max_messages) {
      chatMessages.shift();
    }

    return formattedMessage;
  } catch (error) {
    console.error("Error adding chat message:", error);
    throw error;
  }
};

const getMessages = () => {
  return chatMessages;
};

const loadIgnoreList = async () => {
  console.log("[CHAT] Loading Ignore List");

  const ignores = await ChatIgnore.findAll({
    where: {
      removed: 0,
    },
  });

  ignores.forEach((ignore) => {
    if (!ignoreList[ignore.userid]) {
      ignoreList[ignore.userid] = [];
    }
    ignoreList[ignore.userid].push(ignore.ignoreid);
  });
};

const chatCommands = {
  ignore: async (user, socket, args) => {
    if (args.length < 1) {
      return socket.emit("message", {
        type: "error",
        error: "Error: User ID is required!",
      });
    }

    const ignoreId = args[0];
    if (ignoreId === user.userid) {
      return socket.emit("message", {
        type: "error",
        error: "Error: You cannot ignore yourself!",
      });
    }

    const existingIgnore = await ChatIgnore.findOne({
      where: {
        userid: user.userid,
        ignoreid: ignoreId,
        removed: 0,
      },
    });

    if (existingIgnore) {
      return socket.emit("message", {
        type: "error",
        error: "Error: This user is already ignored!",
      });
    }

    await ChatIgnore.create({
      userid: user.userid,
      ignoreid: ignoreId,
      time: Math.floor(Date.now() / 1000),
      removed: 0,
    });

    if (!chat_ignoreList[user.userid]) {
      chat_ignoreList[user.userid] = [];
    }
    chat_ignoreList[user.userid].push(ignoreId);

    socket.emit("message", {
      type: "success",
      success: "User successfully ignored!",
    });
  },
  unignore: async (user, socket, args) => {
    if (args.length < 1) {
      return socket.emit("message", {
        type: "error",
        error: "Error: User ID is required!",
      });
    }

    const ignoreId = args[0];
    const ignore = await ChatIgnore.findOne({
      where: {
        userid: user.userid,
        ignoreid: ignoreId,
        removed: 0,
      },
    });

    if (!ignore) {
      return socket.emit("message", {
        type: "error",
        error: "Error: This user is not ignored!",
      });
    }

    ignore.removed = 1;
    await ignore.save();

    chat_ignoreList[user.userid] = chat_ignoreList[user.userid].filter(
      (id) => id !== ignoreId
    );

    socket.emit("message", {
      type: "success",
      success: "User successfully unignored!",
    });
  },
};

const handleCommand = async (user, socket, message) => {
  const [command, ...args] = message.split(" ");
  const commandHandler = chatCommands[command.slice(1)];
  if (commandHandler) {
    await commandHandler(user, socket, args);
  } else {
    socket.emit("message", { type: "error", error: "Error: Invalid command!" });
  }
};

module.exports = {
  loadMessages,
  addMessage,
  getMessages,
  otherMessages,
  checkMessage,
  loadIgnoreList,
  handleCommand,
  ignoreList,
};
