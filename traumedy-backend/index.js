const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ===================== MIDDLEWARE =====================
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ===================== IN-MEMORY DATA =====================
const users = [
  { username: "admin", password: "password", email: "admin@example.com" },
];

const waitingUsers = []; // REST matching
const waitingPool = []; // Real-time waiting room
const rooms = {};        // roomId -> socketIds
const roomHistory = {};  // roomId -> messages

// ===================== AUTH ROUTES =====================
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

// ===================== REST MATCHING =====================
app.post("/api/match", (req, res) => {
  const { email, topic, mode } = req.body;
  if (!email || !topic || !mode)
    return res.status(400).json({ error: "Missing parameters" });

  const matchIndex = waitingUsers.findIndex(
    (u) => u.topic === topic && u.mode === mode && u.email !== email
  );

  if (matchIndex !== -1) {
    const matchedUser = waitingUsers.splice(matchIndex, 1)[0];
    const roomId = uuidv4();
    return res.json({ matched: true, roomId, partnerEmail: matchedUser.email });
  }

  waitingUsers.push({ email, topic, mode, joinedAt: Date.now() });
  return res.json({ matched: false });
});

app.get("/health", (req, res) => {
  res.send("Server is healthy 🚀");
});

// ===================== SOCKET.IO REAL-TIME CHAT =====================
const io = new Server(server, {
  cors: { origin: "http://localhost:8080", credentials: true },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // --------------------- WAITING ROOM ---------------------
  socket.on("joinWaitingRoom", ({ user, topic, mode }) => {
    waitingPool.push({ socketId: socket.id, user, topic, mode });
    socket.username = user;

    // Try to find a match
    const matchIndex = waitingPool.findIndex(
      (u) => u.topic === topic && u.mode === mode && u.socketId !== socket.id
    );

    if (matchIndex !== -1) {
      const matchedUser = waitingPool.splice(matchIndex, 1)[0];
      waitingPool.splice(waitingPool.findIndex(u => u.socketId === socket.id), 1);

      const roomId = uuidv4();
      rooms[roomId] = [socket.id, matchedUser.socketId];
      roomHistory[roomId] = [];

      // ----------------- Join both users -----------------
      socket.join(roomId);
      io.sockets.sockets.get(matchedUser.socketId).join(roomId);

      // ----------------- System messages -----------------
      const systemMsg1 = { sender: "System", text: `${user} joined the chat` };
      const systemMsg2 = { sender: "System", text: `${matchedUser.user} joined the chat` };
      roomHistory[roomId].push(systemMsg1, systemMsg2);

      io.to(roomId).emit("message", systemMsg1);
      io.to(roomId).emit("message", systemMsg2);

      // ----------------- Notify clients about match -----------------
      io.to(socket.id).emit("matched", { roomId, partner: matchedUser.user, history: roomHistory[roomId] });
      io.to(matchedUser.socketId).emit("matched", { roomId, partner: user, history: roomHistory[roomId] });
    }
  });

  // --------------------- JOIN ROOM (OPTIONAL) ---------------------
  socket.on("joinRoom", ({ roomId, user }) => {
    socket.join(roomId);
    const msg = { sender: "System", text: `${user} joined the chat` };
    roomHistory[roomId] = roomHistory[roomId] || [];
    roomHistory[roomId].push(msg);
    socket.to(roomId).emit("message", msg);
  });

  // --------------------- SEND MESSAGE ---------------------// SEND MESSAGE
socket.on("sendMessage", ({ roomId, sender, text, userId }) => {
  const msg = { sender, text, userId };
  roomHistory[roomId] = roomHistory[roomId] || [];
  roomHistory[roomId].push(msg);

  // Emit to everyone in the room
  io.to(roomId).emit("message", msg);
});

// JOIN ROOM
socket.on("joinRoom", ({ roomId, user, userId }) => {
  socket.join(roomId);

  // Send chat history to this user
  socket.emit("matched", { roomId, partner: "Stranger", history: roomHistory[roomId] || [] });

  const joinMsg = { sender: "System", text: `${user} joined the chat`, userId: "system" };
  roomHistory[roomId] = roomHistory[roomId] || [];
  roomHistory[roomId].push(joinMsg);

  socket.to(roomId).emit("message", joinMsg);
});

  // --------------------- DISCONNECT ---------------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove from waiting pool
    const index = waitingPool.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) waitingPool.splice(index, 1);

    // Notify rooms if socket was in any room
    for (const [roomId, sockets] of Object.entries(rooms)) {
      if (sockets.includes(socket.id)) {
        socket.to(roomId).emit("message", { sender: "System", text: `A user has left the chat` });
        rooms[roomId] = sockets.filter(id => id !== socket.id);
      }
    }
  });
});

// ===================== START SERVER =====================
server.listen(5000, () => {
  console.log("🚀 Backend running at http://localhost:5000");
});
