const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserDiscordLink = sequelize.define(
  "UserDiscordLink",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    discord_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    verification_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user_discord_links",
  }
);

module.exports = UserDiscordLink;
