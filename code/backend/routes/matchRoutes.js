const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const auth = require("../middleware/auth");
const SkillMatchingAlgorithm = require("../utils/SkillMatchingAlgorithm");
const User = require("../models/User");

router.get("/find", auth, matchController.findMatches);

router.post("/create", auth, matchController.createMatch);
router.put("/update-status", auth, matchController.updateMatchStatus);
router.get("/match/:userId", auth, async (req, res) => {
  if (!req.user) {
    console.log("User not authenticated");
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);
    const allUsers = await User.find({ _id: { $ne: currentUser._id } });

    const matcher = new SkillMatchingAlgorithm(allUsers);
    const matches = matcher.findMatches(currentUser);

    res.json(matches);
  } catch (error) {
    console.error("Error finding matches:", error);
    res.status(500).json({ message: "Error finding matches" });
  }
});
module.exports = router;
