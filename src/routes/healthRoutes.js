const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/api/healthz", (req, res) => {
  try {
    const ok = mongoose.connection.readyState === 1;

    if (!ok) {
      return res.status(500).json({ ok: false });
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
