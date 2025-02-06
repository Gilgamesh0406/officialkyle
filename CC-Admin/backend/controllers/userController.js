// controllers/userController.js
const UserIp = require("../models/UserIp");
const userService = require("../services/userService");
const axios = require("axios");

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(req.query);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.updateUser(id, req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const banUser = async (req, res) => {
  const { id } = req.params;
  const { banned } = req.body;
  try {
    const user = await userService.banUser(id, banned);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user ban status" });
  }
};

const getUserById = async (req, res) => {
  const { userid } = req.params;
  const user = await userService.getUserById(userid);
  const discordLink = await userService.getUserDiscordLink(userid);
  const steamLevel = await axios.get(
    `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${process.env.STEAM_API_KEY}&steamid=${user.email}`
  );
  const usedIps = await UserIp.findAll({
    attributes: ["ip"],
    where: { userid },
    group: "ip",
  });
  const usedIpsString = usedIps.map((ip) => ip.ip).join(", ");
  const playerLevel = steamLevel.data.response.player_level;
  res.status(200).json({
    user: {
      ...user.dataValues,
      discord_id: discordLink?.discord_id || null,
      steam_level: playerLevel,
      used_ips: usedIpsString,
    },
  });
};

const setUserRank = async (req, res) => {
  const { userid } = req.params;
  const { rank } = req.body;
  const user = await userService.setUserRank(userid, rank);
  res.status(200).json(user);
};

const setUserBalance = async (req, res) => {
  const { userid } = req.params;
  const { balance } = req.body;
  const user = await userService.setUserBalance(userid, balance);
  res.status(200).json(user);
};

module.exports = {
  createUser,
  getAllUsers,
  getUsers,
  updateUser,
  deleteUser,
  banUser,
  getUserById,
  setUserRank,
  setUserBalance,
};
