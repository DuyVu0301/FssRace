const db = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const conn = await db.getConnection();

    const [users] = await conn.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      conn.release();
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    const [stravaProfile] = await conn.query(
      "SELECT strava_athlete_id FROM strava_profiles WHERE user_id = ?",
      [userId]
    );

    conn.release();

    res.json({
      ...user,
      stravaConnected: stravaProfile.length > 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const conn = await db.getConnection();

    const [stats] = await conn.query(
      `SELECT 
        COUNT(DISTINCT a.id) as total_activities,
        COALESCE(SUM(a.distance), 0) as total_distance,
        COALESCE(SUM(a.moving_time), 0) as total_moving_time,
        COUNT(DISTINCT ur.race_id) as races_joined
       FROM activities a
       LEFT JOIN user_races ur ON a.user_id = ur.user_id
       WHERE a.user_id = ?`,
      [userId]
    );

    conn.release();

    res.json(stats[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required" });
    }

    const conn = await db.getConnection();

    await conn.query("UPDATE users SET username = ?, email = ? WHERE id = ?", [
      username,
      email,
      userId,
    ]);

    conn.release();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, getUserStats, updateProfile };
