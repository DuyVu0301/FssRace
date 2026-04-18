const express = require("express");
const {
  createRace,
  getAllRaces,
  getRaceById,
  updateRace,
  deleteRace,
  joinRace,
  getRaceProgress,
} = require("../controllers/raceController");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllRaces);
router.get("/:id", getRaceById);

// Protected routes
router.post("/join", verifyToken, joinRace);
router.get("/:raceId/progress", verifyToken, getRaceProgress);

// Admin routes
router.post("/", verifyToken, checkRole("admin"), createRace);
router.put("/:id", verifyToken, checkRole("admin"), updateRace);
router.delete("/:id", verifyToken, checkRole("admin"), deleteRace);

module.exports = router;
