const db = require("../config/db");
const {
  syncActivities,
  exchangeCodeForTokens,
} = require("../services/stravaService");

const linkStravaProfile = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({ error: "Authorization code missing" });
    }

    const tokenData = await exchangeCodeForTokens(code);

    const conn = await db.getConnection();

    await conn.query(
      `INSERT INTO strava_profiles (user_id, strava_athlete_id, access_token, refresh_token, expires_at)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE access_token = VALUES(access_token), refresh_token = VALUES(refresh_token), expires_at = VALUES(expires_at)`,
      [
        userId,
        tokenData.athlete.id,
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_at,
      ]
    );

    conn.release();

    res.json({ message: "Strava profile linked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const syncActivitiesHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await syncActivities(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit || 10;

    const conn = await db.getConnection();
    const [activities] = await conn.query(
      "SELECT id, distance, moving_time, start_date_local, activity_type FROM activities WHERE user_id = ? ORDER BY start_date_local DESC LIMIT ?",
      [userId, parseInt(limit)]
    );

    conn.release();

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  linkStravaProfile,
  syncActivitiesHandler,
  getRecentActivities,
};
