const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({
  origin: 'http://localhost:8081', // 👈 Your frontend port
  credentials: true
}));
app.use(express.json());

// In-memory user storage
const users = [
  { username: "admin", password: "password", email: "admin@example.com" },
];

// Signup route - register new users
app.post("/api/signup", (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const userExists = users.some(
    (user) => user.username === username || user.email === email
  );

  if (userExists) {
    return res.status(400).json({ message: "Username or email already taken." });
  }

  users.push({ username, email, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Login route - check admin and registered users
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    return res.json({ token: "test-token-123", message: "Login successful" });
  }

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    return res.json({ token: "user-token-456", message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

app.listen(5000, () => {
  console.log("🚀 Backend running at http://localhost:5000");
});
