import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const waitingUsers = [];

router.post("/", (req, res) => {
  const { email, topic, mode } = req.body;

  if (!email || !topic || !mode) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const matchIndex = waitingUsers.findIndex(
    (u) => u.topic === topic && u.mode === mode && u.email !== email
  );

  if (matchIndex !== -1) {
    const matchedUser = waitingUsers.splice(matchIndex, 1)[0];
    const roomId = uuidv4();
    return res.json({
      matched: true,
      roomId,
      partnerEmail: matchedUser.email
    });
  }

  waitingUsers.push({ email, topic, mode, joinedAt: Date.now() });
  return res.json({ matched: false });
});

export default router;
