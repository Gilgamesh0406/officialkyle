// socket/socketHandler.js
const socketIo = (server) => {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    // Example of emitting an event to the client
    socket.emit("welcome", "Hello from server!");
  });
};

module.exports = socketIo;
