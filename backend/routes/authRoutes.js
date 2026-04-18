const express = require("express");
const {
  register,
  login,
  stravaCallback,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/strava/callback", stravaCallback);

module.exports = router;
