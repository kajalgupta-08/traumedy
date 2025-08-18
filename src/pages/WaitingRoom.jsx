import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const WaitingRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topic, mode } = location.state || {}; // Receive topic & mode
  const [status, setStatus] = useState("Waiting for a match...");

  useEffect(() => {
    const email = localStorage.getItem("email") || `User${Math.floor(Math.random() * 1000)}`;
    if (!topic || !mode) {
      alert("Missing topic or mode. Redirecting back.");
      navigate("/guidelines");
      return;
    }

    socket.emit("joinWaitingRoom", { user: email, topic, mode });

    socket.on("matched", ({ room }) => {
      setStatus("Match found! Redirecting...");
      setTimeout(() => navigate(`/chat?roomId=${room}`), 500);
    });

    return () => socket.off("matched");
  }, [navigate, topic, mode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h2 className="text-xl">{status}</h2>
    </div>
  );
};

export default WaitingRoom;
