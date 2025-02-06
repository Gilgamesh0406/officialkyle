const BlockedSkin = require("../models/BlockedSkin");

// Fetch all BlockedSkins
const getBlockedSkins = async () => {
  return await BlockedSkin.findAll();
};

// Add a new BlockedSkin
const addBlockedSkin = async (skinData) => {
  return await BlockedSkin.create(skinData);
};

const deleteBlockedSkin = async (id) => {
  const skin = await BlockedSkin.findOne({ where: { id } });
  if (skin) {
    await skin.destroy();
  } else {
    throw new Error("Skin not found");
  }
};

module.exports = {
  getBlockedSkins,
  addBlockedSkin,
  deleteBlockedSkin,
};
