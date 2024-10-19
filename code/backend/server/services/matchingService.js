const User = require("../models/User");

exports.findPotentialMatches = async (user) => {
  const potentialMatches = await User.aggregate([
    {
      $match: {
        _id: { $ne: user._id },
        skills: { $elemMatch: { name: { $in: user.learningGoals } } },
        learningGoals: { $in: user.skills.map((skill) => skill.name) },
      },
    },
    {
      $addFields: {
        matchScore: {
          $add: [
            {
              $size: { $setIntersection: ["$skills.name", user.learningGoals] },
            },
            {
              $size: {
                $setIntersection: [
                  "$learningGoals",
                  user.skills.map((skill) => skill.name),
                ],
              },
            },
          ],
        },
      },
    },
    { $sort: { matchScore: -1 } },
    { $limit: 20 },
    { $project: { password: 0 } },
  ]);

  return potentialMatches;
};
