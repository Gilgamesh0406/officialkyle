const express = require("express");
const router = express.Router();
const steamBotsController = require("../controllers/steamBotsController");

// Get all Steam bots
router.get("/", steamBotsController.getSteamBots);

// Add a new Steam bot
router.post("/", steamBotsController.addSteamBot);

// Delete a Steam bot
router.post("/delete", steamBotsController.deleteSteamBot);

module.exports = router;
