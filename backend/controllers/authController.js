const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { exchangeCodeForTokens } = require("../services/stravaService");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conn = await db.getConnection();

    // Check if user exists
    const [existing] = await conn.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length) {
      conn.release();
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await conn.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    conn.release();

    const token = jwt.sign(
      { id: result.insertId, username, email, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    res.status(201).json({
      message: "User registered",
      token,
      user: { id: result.insertId, username, email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const conn = await db.getConnection();
    const [users] = await conn.query(
      "SELECT id, username, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      conn.release();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      conn.release();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    conn.release();

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const stravaCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code missing" });
    }

    const tokenData = await exchangeCodeForTokens(code);

    const conn = await db.getConnection();

    // Check if profile exists
    const [existing] = await conn.query(
      "SELECT user_id FROM strava_profiles WHERE strava_athlete_id = ?",
      [tokenData.athlete.id]
    );

    if (existing.length) {
      // Update existing profile
      await conn.query(
        "UPDATE strava_profiles SET access_token = ?, refresh_token = ?, expires_at = ? WHERE strava_athlete_id = ?",
        [
          tokenData.access_token,
          tokenData.refresh_token,
          tokenData.expires_at,
          tokenData.athlete.id,
        ]
      );

      const userId = existing[0].user_id;
      conn.release();

      const [users] = await conn.query(
        "SELECT id, username, email, role FROM users WHERE id = ?",
        [userId]
      );
      const user = users[0];

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}?token=${token}&stravaConnected=true`
      );
    }

    // Create new user from Strava athlete data if needed
    // For now, assume user exists; they link Strava via dashboard
    conn.release();

    res.status(400).json({ error: "User not found. Please register first." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, stravaCallback };
