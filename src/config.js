require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5432,
  databaseUrl: process.env.DATABASE_URL || "postgresql://becoquin_user:gwteD4EeuhOYfQxqTyfr5rPeKAvXHlmr@dpg-davq6jegekts73f223c0-a/becoquin",
  adminApiKey: process.env.ADMIN_API_KEY || "ADMIN",
};
