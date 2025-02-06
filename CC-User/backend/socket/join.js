const {
  getUserBySession,
  getInitialData,
  getGuestInitialData,
} = require("../services/userService");
const { calculateLevel } = require("../utils/helpers");

module.exports = async (socket, io, data) => {
  const { session, paths, channel } = data;
  console.log("[SESSION]", session);
  let onlineUsers = {};

  if (paths.length <= 0) {
    socket.emit("message", {
      type: "error",
      error: "Error: Your page is now inactive! Please refresh the page.",
    });
    return;
  }

  try {
    // for unauthorized
    if (!session) {
      const initialData = getGuestInitialData(channel);
      socket.join(paths[0]);
      socket.emit("message", initialData);

      io.sockets.emit("message", {
        type: "online",
        online: Object.keys(io.sockets.sockets).length,
      });
      return;
    }
    // for authorized
    const user = await getUserBySession(session);

    if (!user) {
      socket.emit("message", {
        type: "error",
        error: "Error: Invalid session! Please login again.",
      });
      console.log("[SERVER] User with session " + session + " is not found");
      return;
    }

    socket.user = user;
    socket.join(user.userid);
    socket.join(paths[0]);
    console.log(`[SERVER] User with userid ${user.userid} is connected`);

    if (onlineUsers[user.userid] === undefined) {
      onlineUsers[user.userid] = {
        count: 0,
        user: {
          userid: user.userid,
          name: user.name,
          avatar: user.avatar,
          level: calculateLevel(user.xp).level,
          rank: user.rank,
          guest: 0,
        },
      };
    }

    onlineUsers[user.userid].count++;

    const initialData = await getInitialData(user, channel);

    socket.emit("message", initialData);

    io.sockets.emit("message", {
      type: "online",
      online: Object.keys(onlineUsers).length,
    });
  } catch (err) {
    console.error(err);
    socket.emit("message", {
      type: "error",
      error: "Error: Unable to authenticate user.",
    });
  }
};
