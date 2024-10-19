// utils/gamificationLogic.js
const User = require("../models/User");
const Achievement = require("../models/Achievement");

async function updateUserProgress(userId, action) {
  const user = await User.findById(userId);

  switch (action.type) {
    case "COMPLETE_CHALLENGE":
      user.points += action.points;
      user.completedChallenges.push(action.challengeId);
      user.currentChallenges = user.currentChallenges.filter(
        (c) => c.challenge.toString() !== action.challengeId.toString()
      );
      break;
    // Add more cases for different actions
  }

  await checkAchievements(user);
  await user.save();
}

async function checkAchievements(user) {
  const achievements = await Achievement.find();

  for (const achievement of achievements) {
    if (!user.unlockedAchievements.includes(achievement._id)) {
      const condition = eval(achievement.condition);
      if (condition(user)) {
        user.unlockedAchievements.push(achievement._id);
        // Trigger notification for unlocked achievement
      }
    }
  }
}

module.exports = { updateUserProgress };
