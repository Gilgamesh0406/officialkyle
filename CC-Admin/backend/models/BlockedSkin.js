const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BlockedSkin = sequelize.define(
  "BlockedSkin",
  {
    blockMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "blockedskins",
  }
);

module.exports = BlockedSkin;
