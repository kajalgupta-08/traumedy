import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const waitingUsers = [];
const activeMatches = new Map(); // Store roomId for matched pairs

router.post("/", (req, res) => {
  const { email, topic, mode } = req.body;

  if (!email || !topic || !mode) {
    return res.status(400).json({ error: "Missing parameters" });
  }

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

  // Look for immediate match
  const matchIndex = waitingUsers.findIndex(
    (u) => u.topic === topic && u.mode === mode
  );

  if (matchIndex !== -1) {
    const matchedUser = waitingUsers.splice(matchIndex, 1)[0];
    const roomId = uuidv4();
    
    // Store the match so both users get same room
    activeMatches.set(roomId, [email, matchedUser.email]);
    
    console.log(`Match found: ${email} <-> ${matchedUser.email} in room ${roomId}`);
    
    return res.json({
      matched: true,
      roomId,
      partnerEmail: matchedUser.email
    });
  }

  // No match found - add to waiting list
  waitingUsers.push({ email, topic, mode, joinedAt: Date.now() });
  console.log(`User ${email} waiting for ${topic}/${mode}. Queue: ${waitingUsers.length}`);
  
  return res.json({ matched: false });
});

export default router;
