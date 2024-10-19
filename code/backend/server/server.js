const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");
// ... (other imports)

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).single("file");

// ... (other middleware and routes)

io.on("connection", (socket) => {
  socket.on("join", ({ userId, matchId }) => {
    socket.join(matchId);
  });

  socket.on("leave", ({ userId, matchId }) => {
    socket.leave(matchId);
  });

  socket.on("sendMessage", (data, callback) => {
    upload(data, null, (err) => {
      if (err) {
        return callback({ error: "File upload failed" });
      }
      const { userId, matchId, text } = data;
      const message = {
        userId,
        text,
        file: data.file ? `/uploads/${data.file.filename}` : null,
      };
      io.to(matchId).emit("message", message);
      callback({ success: true });
    });
  });
});

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ... (start the server)
