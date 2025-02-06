// app.js
const express = require("express");
const sequelize = require("./config/database");
const routes = require("./routes");
const path = require("path");
const socketIo = require("./socket/socketHandler");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up the server and socket.io
const server = app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  // Sync Sequelize models
  try {
    await sequelize.sync({ force: false });
    console.log("Database connected and models synced");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  socketIo(server);
});
