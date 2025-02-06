const http = require("http");
const https = require("https");
const fs = require("fs");
const cron = require("node-cron");
const config = require("./config/config");
const app = require("./app");
const sequelize = require("./config/db");
const socket = require("./socket");
const axios = require("axios");
require("./src/discordBot");

const sslOption = {
  key: fs.readFileSync("./ssl/cloudflare.key"),
  cert: fs.readFileSync("./ssl/cloudflare.crt"),
};

const server =
  config.node_env == "development"
    ? http.createServer(app)
    : https.createServer(sslOption, app);

socket.init(server);

const { loadItems, loadPrices } = require("./services/itemService");
const { loadCases } = require("./services/dailyCaseService");
const coinflipService = require("./services/coinflipService");
const chatService = require("./services/chatService");
const plinkoService = require("./services/plinkoService");
const unboxingService = require("./services/unboxingService");
const caseBattleService = require("./services/caseBattleService");
const { ItemsList } = require("./models");
const Setting = require("./models/Setting");

sequelize
  .sync()
  .then(async () => {
    console.log("Database connected");

    await loadItems();
    // await loadPrices();
    await loadCases();

    await unboxingService.loadCases();
    await unboxingService.loadHistory();

    await caseBattleService.loadStats();
    await caseBattleService.loadGameCases();
    await caseBattleService.loadHistory();

    await coinflipService.loadHistory();
    await plinkoService.loadHistory();
    await chatService.loadMessages();

    const updateItemsList = async () => {
      try {
        const response = await axios.get(
          "https://steamwebapi.com/steam/api/items?key=DBMAXP0QRCG69O9C&game=rust"
        );
        const items = response.data;
        console.log("Update Item List Length", items.length);
        let itemsToCreate = [];
        let idx = 0;
        for (const item of items) {
          itemsToCreate.push({
            id: idx,
            itemid: item.id,
            name: item.markethashname,
            image: item.itemimage ? item.itemimage : "",
            price: item.pricelatest
              ? item.pricelatest
              : item.priceavg
              ? item.priceavg
              : 0,
            quality: item.quality ? item.quality : "",
            time: Date.now(),
            type: "",
          });
          idx++;
        }
        await ItemsList.destroy({ where: {} }); // Delete all records in the table
        console.log("Existing items deleted.");
        await ItemsList.bulkCreate(itemsToCreate);
        console.log("Items list updated successfully!");
      } catch (error) {
        console.log("error");
      }
    };

    const updatePriceSetting = await Setting.findOne({
      where: { key: "update_rust_skins" },
    });
    const intervalTime = updatePriceSetting ? updatePriceSetting.value : 20;

    console.log("[intervalTime]", intervalTime);
    setInterval(updateItemsList, parseInt(intervalTime) * 60 * 1000);

    updateItemsList();
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
