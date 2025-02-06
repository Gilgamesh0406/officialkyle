const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserIp = sequelize.define(
  "UserIp",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "user_ips",
  }
);

module.exports = UserIp;
