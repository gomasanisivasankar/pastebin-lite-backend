const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/api/healthz", (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(ok ? 200 : 500).json({ ok });
});

module.exports = router;
