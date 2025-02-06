const SteamBot = require("../models/SteamBot");

// Fetch all Steam bots
const getSteamBots = async () => {
  return await SteamBot.findAll();
};

// Add a new Steam bot
const addSteamBot = async (botData) => {
  return await SteamBot.create(botData);
};

// Delete a Steam bot by account name
const deleteSteamBot = async (accountName) => {
  const bot = await SteamBot.findOne({ where: { accountName } });
  if (bot) {
    await bot.destroy();
  } else {
    throw new Error("Bot not found");
  }
};

module.exports = {
  getSteamBots,
  addSteamBot,
  deleteSteamBot,
};
