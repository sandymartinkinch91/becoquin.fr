const express = require("express");
const License = require("../models/License");
const { generateLicenseKey, hashHwid } = require("../utils/helpers");
const { verifyAdminKey } = require("../middleware/auth");

const router = express.Router();

// POST /licenses/generate  (Admin only)
router.post("/generate", verifyAdminKey, async (req, res) => {
  try {
    const count = Math.min(Math.max(parseInt(req.body.count) || 1, 1), 50);
    const notes = req.body.notes || null;

    const licenses = [];

    for (let i = 0; i < count; i++) {
      let key = generateLicenseKey();

      // Ensure uniqueness
      while (await License.findOne({ where: { key } })) {
        key = generateLicenseKey();
      }

      const license = await License.create({ key, notes });
      licenses.push(license);
    }

    res.json(
      licenses.map((l) => ({
        key: l.key,
        is_active: l.isActive,
        is_activated: l.isActivated,
        created_at: l.createdAt,
        activated_at: l.activatedAt,
        notes: l.notes,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /licenses/activate
router.post("/activate", async (req, res) => {
  try {
    const { key, hwid } = req.body;

    if (!key || !hwid) {
      return res.status(400).json({
        success: false,
        message: "key and hwid are required",
      });
    }

    const license = await License.findOne({
      where: { key: key.toUpperCase() },
    });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License key not found",
      });
    }

    if (!license.isActive) {
      return res.status(400).json({
        success: false,
        message: "License has been revoked",
      });
    }

    if (license.isActivated) {
      if (license.hwidHash === hashHwid(hwid)) {
        return res.json({
          success: true,
          message: "License already activated on this machine",
        });
      }
      return res.status(400).json({
        success: false,
        message: "License already activated on another machine",
      });
    }

    // First activation
    license.hwidHash = hashHwid(hwid);
    license.isActivated = true;
    license.activatedAt = new Date();
    await license.save();

    res.json({
      success: true,
      message: "License activated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /licenses/validate
router.post("/validate", async (req, res) => {
  try {
    const { key, hwid } = req.body;

    if (!key || !hwid) {
      return res.json({
        success: false,
        message: "key and hwid are required",
      });
    }

    const license = await License.findOne({
      where: { key: key.toUpperCase() },
    });

    if (!license) {
      return res.json({ success: false, message: "Invalid license key" });
    }

    if (!license.isActive) {
      return res.json({ success: false, message: "License has been revoked" });
    }

    if (!license.isActivated) {
      return res.json({
        success: false,
        message: "License not activated yet",
      });
    }

    if (license.hwidHash !== hashHwid(hwid)) {
      return res.json({ success: false, message: "HWID mismatch" });
    }

    res.json({ success: true, message: "License is valid" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /licenses/:key  (Admin only)
router.get("/:key", verifyAdminKey, async (req, res) => {
  try {
    const license = await License.findOne({
      where: { key: req.params.key.toUpperCase() },
    });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License not found",
      });
    }

    res.json({
      key: license.key,
      is_active: license.isActive,
      is_activated: license.isActivated,
      created_at: license.createdAt,
      activated_at: license.activatedAt,
      notes: license.notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /licenses/:key/revoke  (Admin only)
router.post("/:key/revoke", verifyAdminKey, async (req, res) => {
  try {
    const license = await License.findOne({
      where: { key: req.params.key.toUpperCase() },
    });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License not found",
      });
    }

    license.isActive = false;
    await license.save();

    res.json({ success: true, message: "License revoked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
