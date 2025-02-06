const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SteamBot = sequelize.define("SteamBot", {
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sharedSecret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = SteamBot;
