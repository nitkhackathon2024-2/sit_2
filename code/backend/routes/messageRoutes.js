const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:userId/:otherUserId", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId, receiverId: req.params.otherUserId },
        { senderId: req.params.otherUserId, receiverId: req.params.userId },
      ],
    }).sort("timestamp");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
