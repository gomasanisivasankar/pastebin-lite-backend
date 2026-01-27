const Paste = require("../models/Paste");
const getNow = require("../utils/getNow");
const { nanoid } = require("nanoid");

/* CREATE PASTE */
exports.createPaste = async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  let expiresAt = null;
  if (ttl_seconds) {
    expiresAt = new Date(Date.now() + ttl_seconds * 1000);
  }

  const id = nanoid(10);

  await Paste.create({
    _id: id,
    content,
    expiresAt,
    maxViews: max_views ?? null
  });

  res.status(201).json({
    id,
    url: `${process.env.BASE_URL}/p/${id}`
  });
};

/* FETCH PASTE API */
exports.getPasteApi = async (req, res) => {
  const now = getNow(req);
  const paste = await Paste.findById(req.params.id);

  if (!paste) return res.status(404).json({ error: "Not found" });

  if (paste.expiresAt && now >= paste.expiresAt)
    return res.status(404).json({ error: "Expired" });

  if (paste.maxViews !== null && paste.views >= paste.maxViews)
    return res.status(404).json({ error: "View limit exceeded" });

  paste.views += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null ? null : Math.max(paste.maxViews - paste.views, 0),
    expires_at: paste.expiresAt
  });
};

/* VIEW PASTE HTML */
exports.getPasteHtml = async (req, res) => {
  const now = getNow(req);
  const paste = await Paste.findById(req.params.id);

  if (!paste) return res.status(404).send("Not Found");
  if (paste.expiresAt && now >= paste.expiresAt) return res.status(404).send("Not Found");
  if (paste.maxViews !== null && paste.views >= paste.maxViews)
    return res.status(404).send("Not Found");

  const safe = paste.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  res.setHeader("Content-Type", "text/html");
  res.send(`<pre>${safe}</pre>`);
};

