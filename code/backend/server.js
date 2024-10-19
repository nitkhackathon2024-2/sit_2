const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");
const challengeRoutes = require("./routes/challengeRoutes");

// Import route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.json({ fileUrl });
  } else {
    res.status(400).json({ error: "No file uploaded or file upload failed." });
  }
});

// Serve uploaded files
app.use("/uploads", express.static("uploads"));
global.io = io;
io.on("connection", (socket) => {
  socket.on("join", ({ userId, otherUserId }) => {
    const room = [userId, otherUserId].sort().join("-");
    socket.join(room);
    socket.emit("joined", { userId, otherUserId });
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const message = new Message({ senderId, receiverId, text });
      await message.save();

      const room = [senderId, receiverId].sort().join("-");
      io.to(room).emit("message", message);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("messageError", { error: "Failed to save message" });
    }
  });
  // WebRTC signaling
  socket.on("offer", (data) => {
    console.log("Received offer from", socket.id, "for", data.to);
    socket.to(data.to).emit("offer", { ...data, from: socket.id });
  });

  socket.on("answer", (data) => {
    console.log("Received answer from", socket.id, "for", data.to);
    socket.to(data.to).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    console.log("Received ICE candidate from", socket.id, "for", data.to);
    socket.to(data.to).emit("ice-candidate", data);
  });
  socket.on("stop-sharing", (data) => {
    socket.to(data.to).emit("stop-sharing");
  });
  socket.on("authenticate", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
function sendNotification(userId, notification) {
  io.to(userId).emit("notification", notification);
}
// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/challenges", challengeRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
