const express = require("express");
const {
  linkStravaProfile,
  syncActivitiesHandler,
  getRecentActivities,
} = require("../controllers/stravaController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/link", verifyToken, linkStravaProfile);
router.post("/sync", verifyToken, syncActivitiesHandler);
router.get("/activities", verifyToken, getRecentActivities);

module.exports = router;
