const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  skills: [SkillSchema],
  learningGoals: [{ type: String, trim: true }],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  skillsToLearn: [String],
  learningStyle: String,
  availability: [String],
  goals: String,
  experienceLevel: Number,
  preferredLanguage: String,
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],

  points: { type: Number, default: 0 },
  completedChallenges: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  ],
  unlockedAchievements: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Achievement" },
  ],
  currentChallenges: [
    {
      challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
      progress: { type: Number, default: 0 },
      startedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
