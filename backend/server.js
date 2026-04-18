const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./config/db");

dotenv.config();

const app = express();

// ...existing middleware...
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Test database connection
db.getConnection()
  .then(() => console.log("✓ Connected to MySQL database"))
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/strava", require("./routes/stravaRoutes"));
app.use("/api/races", require("./routes/raceRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "FSS Race Backend API", status: "running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
