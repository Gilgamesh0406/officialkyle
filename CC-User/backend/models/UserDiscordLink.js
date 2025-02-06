const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserDiscordLink = sequelize.define(
  "UserDiscordLink",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    discord_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    verification_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "user_discord_links",
    charset: "utf16",
    collate: "utf16_unicode_ci",
  }
);

module.exports = UserDiscordLink;
