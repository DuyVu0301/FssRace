const db = require("../config/db");

const createRace = async (req, res) => {
  try {
    const { title, distance_target, start_date, end_date, description } =
      req.body;

    if (!title || !distance_target || !start_date || !end_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conn = await db.getConnection();

    const [result] = await conn.query(
      "INSERT INTO races (title, distance_target, start_date, end_date, description) VALUES (?, ?, ?, ?, ?)",
      [title, distance_target, start_date, end_date, description || null]
    );

    conn.release();

    res.status(201).json({ message: "Race created", raceId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllRaces = async (req, res) => {
  try {
    const conn = await db.getConnection();

    const [races] = await conn.query(
      "SELECT * FROM races ORDER BY start_date DESC"
    );

    conn.release();

    res.json(races);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const conn = await db.getConnection();

    const [races] = await conn.query("SELECT * FROM races WHERE id = ?", [id]);

    if (!races.length) {
      conn.release();
      return res.status(404).json({ error: "Race not found" });
    }

    conn.release();

    res.json(races[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRace = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, distance_target, start_date, end_date, description } =
      req.body;

    const conn = await db.getConnection();

    await conn.query(
      "UPDATE races SET title = ?, distance_target = ?, start_date = ?, end_date = ?, description = ? WHERE id = ?",
      [title, distance_target, start_date, end_date, description || null, id]
    );

    conn.release();

    res.json({ message: "Race updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRace = async (req, res) => {
  try {
    const { id } = req.params;

    const conn = await db.getConnection();

    await conn.query("DELETE FROM races WHERE id = ?", [id]);

    conn.release();

    res.json({ message: "Race deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const joinRace = async (req, res) => {
  try {
    const userId = req.user.id;
    const { raceId } = req.body;

    const conn = await db.getConnection();

    await conn.query(
      "INSERT INTO user_races (user_id, race_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = created_at",
      [userId, raceId]
    );

    conn.release();

    res.json({ message: "Joined race successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRaceProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { raceId } = req.params;

    const conn = await db.getConnection();

    const [data] = await conn.query(
      `SELECT r.id, r.title, r.distance_target, COALESCE(SUM(a.distance), 0) as total_distance
       FROM races r
       LEFT JOIN user_races ur ON r.id = ur.race_id
       LEFT JOIN activities a ON ur.user_id = a.user_id AND a.start_date_local BETWEEN r.start_date AND r.end_date
       WHERE r.id = ? AND ur.user_id = ?
       GROUP BY r.id`,
      [raceId, userId]
    );

    conn.release();

    if (!data.length) {
      return res
        .status(404)
        .json({ error: "Race or user participation not found" });
    }

    const progress = data[0];
    const percentage = (
      (progress.total_distance / progress.distance_target) *
      100
    ).toFixed(2);

    res.json({ ...progress, percentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRace,
  getAllRaces,
  getRaceById,
  updateRace,
  deleteRace,
  joinRace,
  getRaceProgress,
};
