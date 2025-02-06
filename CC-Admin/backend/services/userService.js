// services/userService.js
const { Op } = require("sequelize");
const User = require("../models/User");
const UserDiscordLink = require("../models/UserDiscordLink");

const createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

const getAllUsers = async (query) => {
  const users = await User.findAndCountAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${query.searchTerm}%`,
          },
        },
        {
          userid: {
            [Op.like]: `%${query.searchTerm}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${query.searchTerm}%`,
          },
        },
      ],
      userid: {
        [Op.not]: "administrator",
      },
    },
    limit: parseInt(query.rowsPerPage),
    offset: parseInt(query.page) * parseInt(query.rowsPerPage),
  });
  return users;
};

const getUserById = async (userid) => {
  const user = await User.findOne({ where: { userid } });
  return user;
};

const getUserDiscordLink = async (userid) => {
  const discordLink = await UserDiscordLink.findOne({
    where: { userid, verified: true },
  });
  return discordLink;
};

const setUserRank = async (userid, rank) => {
  const user = await User.findOne({ where: { userid } });
  user.rank = rank;
  await user.save();
  return user;
};

const setUserBalance = async (userid, balance) => {
  const user = await User.findOne({ where: { userid } });
  user.balance = balance;
  await user.save();
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserDiscordLink,
  setUserRank,
  setUserBalance,
};
