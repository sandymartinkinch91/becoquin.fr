const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: config.databaseUrl.startsWith("sqlite") ? "sqlite" : "postgres",
  logging: false,
  dialectOptions: config.databaseUrl.includes("sslmode=require")
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});

module.exports = sequelize;
