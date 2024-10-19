import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"], // Make sure the right transport is being used
});
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});
export default socket;
