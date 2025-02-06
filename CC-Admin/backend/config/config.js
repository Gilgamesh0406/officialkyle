require("dotenv").config();

module.exports = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 3306,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  flood: {
    time: 100,
    count: 5,
  },
  maintenance_exclude: ["admin"],
};
