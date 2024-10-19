const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  updateProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/me", auth, getCurrentUser);
router.put("/profile", auth, updateProfile);
const { getAllUsers } = require("../controllers/userController");

// Get all users
router.get("/", auth, getAllUsers);

module.exports = router;
