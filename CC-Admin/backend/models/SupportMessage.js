const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SupportMessage = sequelize.define(
  "SupportMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supportid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    response: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "support_messages",
    timestamps: false,
  }
);

module.exports = SupportMessage;
