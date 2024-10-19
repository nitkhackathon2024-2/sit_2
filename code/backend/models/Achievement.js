const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  condition: { type: String, required: true }, // e.g., "complete_5_challenges"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Achievement", AchievementSchema);
