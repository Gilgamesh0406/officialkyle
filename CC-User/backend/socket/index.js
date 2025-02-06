const socket = require("socket.io");

const joinHandler = require("./join");

const dailyCaseHandler = require("./dailycase");
const inventoryHandler = require("./inventory");

const coinflipHandler = require("./coinflip");
const unboxingHandler = require("./unboxing");
const caseBattleHandler = require("./casebattle");
const plinkoHandler = require("./plinko");
const fairHandler = require("./fair");
const gameBotHandler = require("./gamebot");

const chatHandler = require("./chat");

const caseCreatorHandler = require("./admin/caseCreator");

const config = require("../config");
const { createTradeOffer } = require("../src/tradeBot");
const { updateBalance } = require("../services/bettingService");
const { UserTrade } = require("../models");

const init = (server) => {
  let io;

  if (config.node_env === "production") {
    console.log("[GameServer] production mode");
    io = socket(server, {
      cors: {
        origin: config.site.url,
        headers: ["Access-Control-Allow-Origin"],
        credentials: true,
      },
    });
  } else {
    console.log("[GameServer] development mode");
    io = socket(server, { cors: "*" });
  }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", async (data) => {
      console.log("[JOIN DATA]", data);
      joinHandler(socket, io, data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on(
      "depositRequest",
      async ({ steamID, userid, items, itemDescriptions }) => {
        try {
          await createTradeOffer(Date.now() % 2, steamID, items);
          socket.emit("message", {
            type: "success",
            success: "Trade offer sent!",
          });
        } catch (err) {
          console.error("Error creating trade offer:", err);
          socket.emit("message", {
            type: "error",
            error: err.message,
          });
        }
      }
    );

    socket.on("updateBalance", (request) => {
      const user = socket.user;
      if (user) updateBalance(user.userid, io);
    });

    socket.on("request", (request) => {
      try {
        // const user = socket.user;
        // if(!user || Object.keys(user).length === 0) {
        //     socket.emit('message', {
        //         type: 'error',
        //         error: 'Error: Invalid session! Please login again.'
        //     })
        //     return ;
        // }

        // Admin commands
        caseCreatorHandler(socket, io, request);

        inventoryHandler(socket, io, request);

        dailyCaseHandler(socket, io, request);

        fairHandler(socket, request);

        coinflipHandler(socket, io, request);

        unboxingHandler(socket, io, request);

        caseBattleHandler(socket, io, request);

        plinkoHandler(socket, io, request);

        chatHandler(socket, io, request);

        gameBotHandler(socket, io, request);
      } catch (error) {
        console.log("Error:", error);
        socket.emit("message", {
          type: "error",
          error: "Error: Unidentified error occured.",
        });
      }
    });
  });

  return io;
};

module.exports = {
  init,
};
