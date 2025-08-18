import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// Initialize Socket.io client
const socket = io("http://localhost:5000", { withCredentials: true });

const ChatRoom = () => {
  const { roomId: paramRoomId } = useParams(); // optional if joining a specific room
  const [messages, setMessages] = useState([]); // { sender, text }
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(paramRoomId || null);
  const [partner, setPartner] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const email = localStorage.getItem("email") || `User${Math.floor(Math.random() * 1000)}`;
    setUsername(email);

    // ------------------ Join waiting room ------------------
    if (!roomId) {
      socket.emit("joinWaitingRoom", { user: email, topic: "default", mode: "video" });
    }

    // ------------------ Socket listeners ------------------
    socket.on("matched", ({ roomId: newRoomId, partner: matchedUser }) => {
      setRoomId(newRoomId);
      setPartner(matchedUser);
      addMessage({ sender: "System", text: `Matched with ${matchedUser}` });

      // Join the room for system messages
      socket.emit("joinRoom", { roomId: newRoomId, user: email });
    });

    socket.on("message", (msg) => {
      addMessage(msg);
    });

    return () => {
      socket.off("matched");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessage = () => {
    if (!input.trim() || !roomId) return;

    const msg = { roomId, sender: username, text: input };
    socket.emit("sendMessage", msg);
    addMessage(msg);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-2">Room ID: {roomId || "Waiting for match..."}</h2>
      {partner && <h3 className="text-md mb-4 text-gray-400">Chatting with: {partner}</h3>}

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${msg.sender === username ? "bg-blue-600" : msg.sender === "System" ? "bg-gray-500" : "bg-gray-800"}`}
          >
            <strong>{msg.sender}: </strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
