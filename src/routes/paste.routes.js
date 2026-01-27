const express = require("express");
const router = express.Router();
const {
  createPaste,
  getPasteApi,
  getPasteHtml
} = require("../controllers/paste.controller");

router.post("/api/pastes", createPaste);
router.get("/api/pastes/:id", getPasteApi);
router.get("/p/:id", getPasteHtml);

module.exports = router;
