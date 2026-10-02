const crypto = require("crypto");

function generateLicenseKey() {
  const raw = crypto.randomBytes(8).toString("hex").toUpperCase();
  return raw.match(/.{1,4}/g).join("-");
}

function hashHwid(hwid) {
  return crypto.createHash("sha256").update(hwid.trim()).digest("hex");
}

module.exports = {
  generateLicenseKey,
  hashHwid,
};
