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
    origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000", "http://localhost:4173"],
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
const rooms = {};       // roomId -> socketIds
const roomHistory = {}; // roomId -> messages

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
const activeMatches = new Map(); // Store roomId for matched pairs

app.post("/api/match", (req, res) => {
  const { email, topic, mode } = req.body;
  if (!email || !topic || !mode)
    return res.status(400).json({ error: "Missing parameters" });

  console.log(`Match request: ${email} for ${topic}/${mode}`);

  // Check if user is already in an active match
  const existingMatch = Array.from(activeMatches.entries()).find(([roomId, users]) => 
    users.includes(email)
  );
  
  if (existingMatch) {
    console.log(`User ${email} already in room ${existingMatch[0]}`);
    return res.json({
      matched: true,
      roomId: existingMatch[0]
    });
  }

  // Remove any existing entry for this user to prevent duplicates
  const existingIndex = waitingUsers.findIndex(u => u.email === email);
  if (existingIndex !== -1) {
    waitingUsers.splice(existingIndex, 1);
  }

  const matchIndex = waitingUsers.findIndex(
    (u) => u.topic === topic && u.mode === mode
  );

  if (matchIndex !== -1) {
    const matchedUser = waitingUsers.splice(matchIndex, 1)[0];
    const roomId = uuidv4();
    
    // Store the match so both users get same room
    activeMatches.set(roomId, [email, matchedUser.email]);
    
    console.log(`NEW MATCH: ${email} <-> ${matchedUser.email} in room ${roomId}`);
    
    return res.json({ matched: true, roomId, partnerEmail: matchedUser.email });
  }

  waitingUsers.push({ email, topic, mode, joinedAt: Date.now() });
  console.log(`User ${email} waiting. Queue: ${waitingUsers.length}`);
  return res.json({ matched: false });
});

app.get("/health", (req, res) => {
  res.send("Server is healthy 🚀");
});

// ===================== SOCKET.IO REAL-TIME CHAT =====================
const io = new Server(server, {
  cors: { origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000", "http://localhost:4173"], credentials: true },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // --------------------- WAITING ROOM ---------------------
  socket.on("joinWaitingRoom", ({ user, topic, mode }) => {
    console.log(`User ${user} joining waiting room for topic: ${topic}, mode: ${mode}`);
    
    // Try to find a match first
    const matchIndex = waitingPool.findIndex(
      (u) => u.topic === topic && u.mode === mode && u.socketId !== socket.id
    );

    if (matchIndex !== -1) {
      const matchedUser = waitingPool.splice(matchIndex, 1)[0];
      console.log(`Match found! ${user} matched with ${matchedUser.user}`);

      const roomId = uuidv4();
      rooms[roomId] = [socket.id, matchedUser.socketId];
      roomHistory[roomId] = [];

      // Verify both sockets exist
      const matchedSocket = io.sockets.sockets.get(matchedUser.socketId);
      if (!matchedSocket) {
        console.log(`Matched user socket ${matchedUser.socketId} not found, adding back to waiting pool`);
        waitingPool.push({ socketId: socket.id, user, topic, mode });
        return;
      }

      // Both join the room
      socket.join(roomId);
      matchedSocket.join(roomId);

      // System messages
      const systemMsg = { sender: "System", text: `You have been matched! Start your conversation.`, userId: "system" };
      roomHistory[roomId].push(systemMsg);

      // Notify both clients about match with explicit socket targeting
      socket.emit("matched", { roomId, partner: matchedUser.user, history: roomHistory[roomId] });
      matchedSocket.emit("matched", { roomId, partner: user, history: roomHistory[roomId] });
      
      console.log(`Both users notified of match. Room: ${roomId}`);
    } else {
      // No match found, add to waiting pool
      waitingPool.push({ socketId: socket.id, user, topic, mode });
      socket.username = user;
      console.log(`No match found for ${user}. Added to waiting pool. Pool size: ${waitingPool.length}`);
    }
  });

  // --------------------- JOIN ROOM ---------------------
  socket.on("joinRoom", ({ roomId, user, userId }) => {
    socket.join(roomId);

    // Send chat history to joining user
    socket.emit("matched", { roomId, partner: "Stranger", history: roomHistory[roomId] || [] });

    // System join message
    const joinMsg = { sender: "System", text: `${user} joined the chat`, userId: "system" };
    roomHistory[roomId] = roomHistory[roomId] || [];
    roomHistory[roomId].push(joinMsg);
    socket.to(roomId).emit("message", joinMsg);
  });

  // --------------------- SEND MESSAGE ---------------------
  socket.on("sendMessage", ({ roomId, sender, text, userId, socketId }) => {
    const msg = { sender, text, userId, socketId: socket.id };
    roomHistory[roomId] = roomHistory[roomId] || [];
    roomHistory[roomId].push(msg);

    // Emit to all clients in the room (including sender)
    io.to(roomId).emit("message", msg);
  });

  // --------------------- DISCONNECT ---------------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove from waiting pool
    const index = waitingPool.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) {
      const removedUser = waitingPool.splice(index, 1)[0];
      console.log(`Removed ${removedUser.user} from waiting pool. Pool size: ${waitingPool.length}`);
    }

    // Notify rooms if socket was in any room
    for (const [roomId, sockets] of Object.entries(rooms)) {
      if (sockets.includes(socket.id)) {
        socket.to(roomId).emit("message", { 
          sender: "System", 
          text: `Your chat partner has left the conversation.`, 
          userId: "system" 
        });
        rooms[roomId] = sockets.filter(id => id !== socket.id);
        console.log(`User left room ${roomId}`);
      }
    }
  });
});

// ===================== START SERVER =====================
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
