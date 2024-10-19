const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { skills, learningGoals } = req.body;

    // Validate skills
    if (
      !Array.isArray(skills) ||
      skills.some(
        (skill) =>
          typeof skill.name !== "string" ||
          typeof skill.level !== "number" ||
          skill.level < 1 ||
          skill.level > 5
      )
    ) {
      return res.status(400).json({ message: "Invalid skills format" });
    }

    // Validate learning goals
    if (
      !Array.isArray(learningGoals) ||
      learningGoals.some((goal) => typeof goal !== "string")
    ) {
      return res.status(400).json({ message: "Invalid learning goals format" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { skills, learningGoals } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// ... (existing getCurrentUser function)
