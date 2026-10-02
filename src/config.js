require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || "sqlite::memory:",
  adminApiKey: process.env.ADMIN_API_KEY || "changeme",
};
