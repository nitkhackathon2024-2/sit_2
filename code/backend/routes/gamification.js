// routes/gamification.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Achievement = require("../models/Achievement");

// Fetch challenges
router.get("/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Error fetching challenges" });
  }
});

// Fetch achievements
router.get("/achievements", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching achievements" });
  }
});

// Fetch leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort("-points")
      .limit(10)
      .select("name avatar points completedChallenges unlockedAchievements");
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

// Accept a challenge
router.post("/challenges/:challengeId/accept", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const challenge = await Challenge.findById(req.params.challengeId);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    user.currentChallenges.push({ challenge: challenge._id });
    await user.save();

    res.json({ message: "Challenge accepted" });
  } catch (error) {
    res.status(500).json({ message: "Error accepting challenge" });
  }
});

module.exports = router;
