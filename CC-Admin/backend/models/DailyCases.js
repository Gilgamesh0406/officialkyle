const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DailyCases = sequelize.define(
  "DailyCases",
  {
    id: {
      type: DataTypes.BIGINT(32),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    removed: {
      type: DataTypes.BIGINT(32),
      allowNull: false,
      defaultValue: 0,
    },
    caseid: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    items: {
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
    level: {
      type: DataTypes.BIGINT(32),
      allowNull: false,
    },
    time: {
      type: DataTypes.BIGINT(32),
      allowNull: false,
    },
  },
  {
    tableName: "cases_dailycases",
    timestamps: false,
  }
);

module.exports = DailyCases;
