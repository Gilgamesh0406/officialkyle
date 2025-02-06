const steamBotsService = require("../services/steamBotsService");

// Fetch all Steam bots
const getSteamBots = async (req, res) => {
  try {
    const bots = await steamBotsService.getSteamBots();
    res.status(200).json(bots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Steam bots" });
  }
};

// Add a new Steam bot
const addSteamBot = async (req, res) => {
  const { accountName, password, sharedSecret, apiKey } = req.body;

  if (!accountName || !password || !sharedSecret || !apiKey) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newBot = await steamBotsService.addSteamBot({
      accountName,
      password,
      sharedSecret,
      apiKey,
    });
    res.status(201).json(newBot);
  } catch (error) {
    res.status(500).json({ error: "Failed to add Steam bot" });
  }
};

// Delete a Steam bot
const deleteSteamBot = async (req, res) => {
  const { accountName } = req.body;

  if (!accountName) {
    return res.status(400).json({ error: "Account name is required" });
  }

  try {
    await steamBotsService.deleteSteamBot(accountName);
    res.status(200).json({ message: "Steam bot deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Steam bot" });
  }
};

module.exports = {
  getSteamBots,
  addSteamBot,
  deleteSteamBot,
};
