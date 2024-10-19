const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
