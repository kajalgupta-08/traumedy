const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// CORS configuration - Allow all origins for debugging
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// In-memory data
const users = [
  { username: "admin", password: "password", email: "admin@example.com" },
];
const waitingUsers = [];
const waitingPool = [];
const rooms = {};
const roomHistory = {};

// Root route
app.get("/", (req, res) => {
  res.send("Traumedy Backend Server is running! 🚀");
});

// Health check
app.get("/health", (req, res) => {
  res.send("Server is healthy 🚀");
});

// Auth routes
app.post("/api/signup", (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword)
    return res.status(400).json({ message: "All fields are required." });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match." });

  const userExists = users.some(
    (user) => user.username === username || user.email === email
  );
  if (userExists)
    return res.status(400).json({ message: "Username or email already taken." });

  users.push({ username, email, password });
  return res.status(201).json({ message: "User registered successfully" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) return res.json({ token: "user-token-456", message: "Login successful" });
  return res.status(401).json({ message: "Invalid credentials" });
});

// Match API with enhanced logging
app.post("/api/match", (req, res) => {
  console.log("=== MATCH REQUEST RECEIVED ===");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  
  const { email, topic, mode } = req.body;
  console.log("Parsed data:", { email, topic, mode });
  
  if (!email || !topic || !mode) {
    console.log("❌ Missing parameters");
    return res.status(400).json({ error: "Missing parameters" });
  }

  const matchIndex = waitingUsers.findIndex(
    (u) => u.topic === topic && u.mode === mode && u.email !== email
  );

  if (matchIndex !== -1) {
    const matchedUser = waitingUsers.splice(matchIndex, 1)[0];
    const roomId = uuidv4();
    console.log("✅ Match found:", { roomId, email, matchedUser: matchedUser.email });
    return res.json({ matched: true, roomId, partnerEmail: matchedUser.email });
  }

  waitingUsers.push({ email, topic, mode, joinedAt: Date.now() });
  console.log("⏳ Added to waiting list:", email, "Total waiting:", waitingUsers.length);
  return res.json({ matched: false });
});

// Socket.IO setup
const io = new Server(server, {
  cors: { 
    origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000", "http://localhost:4173"], 
    credentials: true 
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinWaitingRoom", ({ user, topic, mode }) => {
    console.log("User joining waiting room:", { user, topic, mode });
    waitingPool.push({ socketId: socket.id, user, topic, mode });
    socket.username = user;

    const matchIndex = waitingPool.findIndex(
      (u) => u.topic === topic && u.mode === mode && u.socketId !== socket.id
    );

    if (matchIndex !== -1) {
      const matchedUser = waitingPool.splice(matchIndex, 1)[0];
      waitingPool.splice(waitingPool.findIndex(u => u.socketId === socket.id), 1);

      const roomId = uuidv4();
      rooms[roomId] = [socket.id, matchedUser.socketId];
      roomHistory[roomId] = [];

      socket.join(roomId);
      io.sockets.sockets.get(matchedUser.socketId).join(roomId);

      console.log("Match found via socket:", { roomId, user, partner: matchedUser.user });

      io.to(socket.id).emit("matched", { roomId, partner: matchedUser.user });
      io.to(matchedUser.socketId).emit("matched", { roomId, partner: user });
    }
  });

  socket.on("sendMessage", ({ roomId, sender, text }) => {
    const msg = { sender, text };
    roomHistory[roomId] = roomHistory[roomId] || [];
    roomHistory[roomId].push(msg);
    io.to(roomId).emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const index = waitingPool.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) waitingPool.splice(index, 1);
  });
});

// Start server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`✅ Server started successfully!`);
});
