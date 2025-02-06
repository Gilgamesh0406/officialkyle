const settingsService = require("../services/settingsService");
const blockedSkinService = require("../services/blockSkinService");

const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: "Key and value are required" });
    }

    const updatedSetting = await settingsService.updateSetting(key, value);
    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: "Failed to update setting" });
  }
};
const getSetting = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({ error: "Key is required" });
    }

    const setting = await settingsService.getSetting(key);

    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve setting" });
  }
};

const blockSkin = async (req, res) => {
  const { blockMethod, blockValue } = req.body;
  if (!blockMethod || !blockValue) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newSkin = await blockedSkinService.addBlockedSkin({
      blockMethod,
      blockValue,
    });
    res.status(201).json(newSkin);
  } catch (error) {
    res.status(500).json({ error: "Failed to add Steam bot" });
  }
};

const getBlockedSkins = async (req, res) => {
  try {
    const blockedSkins = await blockedSkinService.getBlockedSkins();
    res.status(200).json(blockedSkins);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Blocked Skins" });
  }
};

const deleteBlockedSkin = async (req, res) => {
  const { id } = req.params;

  try {
    await blockedSkinService.deleteBlockedSkin(id);
    res.status(200).json({ message: "Blocked Skin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Blocked Skin" });
  }
};

module.exports = {
  updateSetting,
  getSetting,
  blockSkin,
  getBlockedSkins,
  deleteBlockedSkin,
};
