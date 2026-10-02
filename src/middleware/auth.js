const config = require("../config");

function verifyAdminKey(req, res, next) {
  const apiKey = req.headers["x-admin-api-key"];

  if (!apiKey || apiKey !== config.adminApiKey) {
    return res.status(401).json({
      success: false,
      message: "Invalid or missing Admin API Key",
    });
  }

  next();
}

module.exports = { verifyAdminKey };
