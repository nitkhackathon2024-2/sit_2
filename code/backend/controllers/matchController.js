const Match = require("../models/Match");
const User = require("../models/User");
const matchingService = require("../services/matchingService");
exports.findMatches = async (req, res) => {
  console.log("findMatches called");
  try {
    console.log("User ID:", req.user.id);
    const user = await User.findById(req.user.id);
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const matches = await matchingService.findPotentialMatches(user);
    console.log("Matches found:", matches);
    res.json(matches);
  } catch (error) {
    console.error("Error in findMatches:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.createMatch = async (req, res) => {
  try {
    const { matchedUserId } = req.body;
    const match = new Match({
      users: [req.user.id, matchedUserId],
    });
    await match.save();

    await User.updateMany(
      { _id: { $in: [req.user.id, matchedUserId] } },
      { $push: { matches: match._id } }
    );

    res.json(match);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.updateMatchStatus = async (req, res) => {
  try {
    const { matchId, status } = req.body;
    const match = await Match.findByIdAndUpdate(
      matchId,
      { $set: { status } },
      { new: true }
    );
    res.json(match);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
