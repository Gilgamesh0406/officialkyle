const { Sequelize } = require("sequelize");
const { db } = require("./config");

const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  port: 3306,
});

module.exports = sequelize;
