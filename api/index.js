require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("../src/config/db");
const pasteRoutes = require("../src/routes/pasteRoutes");
const healthRoutes = require("../src/routes/healthRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- DB (serverless-safe) ---------------- */
let isConnected = false;
async function connectOnce() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ MongoDB connected");
  }
}

app.use(async (req, res, next) => {
  await connectOnce();
  next();
});

/* ---------------- ROUTES ---------------- */
app.use(healthRoutes);
app.use(pasteRoutes);

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ---------------- EXPORT FOR VERCEL ---------------- */
module.exports = app;
