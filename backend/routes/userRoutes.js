const express = require("express");
const {
  getProfile,
  getUserStats,
  updateProfile,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.get("/stats", verifyToken, getUserStats);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
