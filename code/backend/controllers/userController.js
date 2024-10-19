const User = require("../models/User");

exports.getCurrentUser = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { skills, learningGoals } = req.body;

    // Validate skills
    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({ msg: "Skills must be an array" });
    }

    const validatedSkills = skills
      ?.map((skill) => {
        if (typeof skill === "string") {
          return { name: skill, level: 1 };
        } else if (typeof skill === "object" && skill.name) {
          return {
            name: skill.name,
            level: Number(skill.level) || 1,
          };
        }
        return null;
      })
      .filter((skill) => skill !== null);

    const updateData = {};
    if (validatedSkills) updateData.skills = validatedSkills;
    if (learningGoals) updateData.learningGoals = learningGoals;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server error");
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
