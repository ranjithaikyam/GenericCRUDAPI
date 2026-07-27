const express = require("express");
const pool = require("./db");
require("dotenv").config();

const genericRoutes = require("./routes/genericRoutes");

console.log("Routes Loaded:", genericRoutes);

const app = express();

app.use(express.json());
app.use("/api", genericRoutes);

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Generic CRUD API Working");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      serverTime: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});