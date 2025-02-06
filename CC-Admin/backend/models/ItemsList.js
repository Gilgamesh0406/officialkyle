const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ItemsList = sequelize.define(
  "ItemsList",
  {
    id: {
      type: DataTypes.BIGINT(32),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    itemid: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(32, 2),
      allowNull: false,
    },
    quality: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stattrak: {
      type: DataTypes.STRING(32),
    },
    souvenir: {
      type: DataTypes.STRING(32),
    },
    update: {
      type: DataTypes.BIGINT(32),
    },
    time: {
      type: DataTypes.BIGINT(32),
      allowNull: false,
    },
  },
  {
    tableName: "items_list",
    timestamps: false,
  }
);

module.exports = ItemsList;
