const User = require("../models/User");

exports.findPotentialMatches = async (user) => {
  try {
    const userSkills = new Map(
      user.skills.map((skill) => [
        typeof skill === "string" ? skill : skill.name,
        typeof skill === "string" ? 1 : skill.level,
      ])
    );

    const allUsers = await User.find({ _id: { $ne: user._id } }).select(
      "-password"
    );

    const scoredMatches = allUsers.map((potentialMatch) => {
      let score = 0;

      // Score based on matching skills to learning goals
      user.learningGoals.forEach((goal) => {
        const matchingSkill = potentialMatch.skills.find(
          (s) =>
            (typeof s === "string" ? s : s.name).toLowerCase() ===
            goal.toLowerCase()
        );
        if (matchingSkill) {
          score += typeof matchingSkill === "string" ? 1 : matchingSkill.level;
        }
      });

      // Score based on matching learning goals to skills
      potentialMatch.learningGoals.forEach((goal) => {
        if (userSkills.has(goal)) {
          score += userSkills.get(goal);
        }
      });

      // Bonus for common learning goals
      const commonLearningGoals = user.learningGoals.filter((goal) =>
        potentialMatch.learningGoals.includes(goal)
      );
      score += commonLearningGoals.length * 0.5;

      // Penalty for skill level disparity
      const skillDisparity = Math.abs(
        user.skills.reduce(
          (sum, s) => sum + (typeof s === "string" ? 1 : s.level),
          0
        ) -
          potentialMatch.skills.reduce(
            (sum, s) => sum + (typeof s === "string" ? 1 : s.level),
            0
          )
      );
      score -= skillDisparity * 0.1;

      return { user: potentialMatch, score };
    });

    // Sort matches by score in descending order
    scoredMatches.sort((a, b) => b.score - a.score);

    // Return top 10 matches or all if less than 10
    return scoredMatches.slice(0, 10).map((match) => match.user);
  } catch (error) {
    console.error("Error in findPotentialMatches:", error);
    throw error;
  }
};
