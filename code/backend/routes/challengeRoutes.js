// routes/challengeRoutes.js
const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");
const auth = require("../middleware/auth");

// Get all challenges
router.get("/", auth, async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Error fetching challenges" });
  }
});

// Create a new challenge
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, points, duration, tags } = req.body;
    const newChallenge = new Challenge({
      title,
      description,
      points,
      duration,
      tags,
    });
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(400).json({ message: "Error creating challenge" });
  }
});

module.exports = router;
