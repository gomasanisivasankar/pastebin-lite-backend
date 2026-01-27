require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const pasteRoutes = require("./routes/paste.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRoutes);
app.use(pasteRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
