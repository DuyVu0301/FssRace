const express = require("express");
const {
  getGlobalLeaderboard,
  getRaceLeaderboard,
} = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/global", getGlobalLeaderboard);
router.get("/race/:raceId", getRaceLeaderboard);

module.exports = router;
