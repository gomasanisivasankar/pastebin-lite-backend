const mongoose = require("mongoose");

const PasteSchema = new mongoose.Schema({
  _id: String,
  content: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  maxViews: {
    type: Number,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Paste", PasteSchema);
