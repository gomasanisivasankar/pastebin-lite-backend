require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const pasteRoutes = require("./routes/pasteRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

/* ---------------- Middleware ---------------- */
app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(pasteRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ---------------- MongoDB connection cache ---------------- */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* =========================================================
   LOCAL vs PRODUCTION (VERCEL) LOGIC
   ========================================================= */

/**
 * If running on Vercel:
 * - Export a handler function
 * - DO NOT call app.listen()
 *
 * If running locally:
 * - Connect DB
 * - Start server with app.listen()
 */

if (process.env.VERCEL) {
  // ✅ Vercel (Serverless)
  module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
  };
} else {
  // ✅ Local development
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to start server:", err);
      process.exit(1);
    });
}
