const db = require("../config/db");

const getGlobalLeaderboard = async (req, res) => {
  try {
    const limit = req.query.limit || 20;

    const conn = await db.getConnection();

    const [leaderboard] = await conn.query(
      `SELECT 
        u.id,
        u.username,
        COALESCE(SUM(a.distance), 0) as total_distance,
        COUNT(DISTINCT a.id) as total_activities,
        ROW_NUMBER() OVER (ORDER BY SUM(a.distance) DESC) as rank
       FROM users u
       LEFT JOIN activities a ON u.id = a.user_id
       GROUP BY u.id, u.username
       ORDER BY total_distance DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    conn.release();

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRaceLeaderboard = async (req, res) => {
  try {
    const { raceId } = req.params;
    const limit = req.query.limit || 20;

    const conn = await db.getConnection();

    const [leaderboard] = await conn.query(
      `SELECT 
        u.id,
        u.username,
        COALESCE(SUM(a.distance), 0) as total_distance,
        COUNT(DISTINCT a.id) as total_activities,
        ROW_NUMBER() OVER (ORDER BY SUM(a.distance) DESC) as rank
       FROM users u
       INNER JOIN user_races ur ON u.id = ur.user_id
       LEFT JOIN activities a ON u.id = a.user_id 
         AND a.start_date_local BETWEEN (
           SELECT start_date FROM races WHERE id = ?
         ) AND (
           SELECT end_date FROM races WHERE id = ?
         )
       WHERE ur.race_id = ?
       GROUP BY u.id, u.username
       ORDER BY total_distance DESC
       LIMIT ?`,
      [raceId, raceId, raceId, parseInt(limit)]
    );

    conn.release();

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getGlobalLeaderboard, getRaceLeaderboard };
