import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Header from "@/components/Header";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:5000");

interface Message {
  sender: string;
  text: string;
  userId: string;
}

const Chat = () => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`);
  const [userId] = useState(uuidv4()); // unique ID for this tab
  const [roomId, setRoomId] = useState<string | null>(paramRoomId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Join room and listen for messages
  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", { roomId, user: username, userId });

    socket.on("matched", ({ history }: { history: Message[] }) => {
      setMessages(history);
    });

    socket.on("message", (msg: Message) => {
      setMessages(prev => [
        ...prev,
        {
          ...msg,
          sender: msg.userId === userId ? "You" : msg.userId === "system" ? "System" : "Stranger"
        }
      ]);
    });

    return () => {
      socket.off("matched");
      socket.off("message");
    };
  }, [roomId, username, userId]);

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = () => {
    if (!input.trim() || !roomId) return;

    const msg = { sender: username, text: input, userId };
    socket.emit("sendMessage", { roomId, ...msg });
    setMessages(prev => [...prev, { ...msg, sender: "You" }]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header showBackButton={true} title="Community Chat" />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-400">Waiting for someone to join...</p>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "System"
                      ? "bg-blue-200 text-gray-800"
                      : msg.sender === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.sender !== "System" && <p className="text-xs opacity-70 mb-1">{msg.sender}</p>}
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={roomId ? "Type your message..." : "Waiting for a match..."}
            disabled={!roomId}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!roomId}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
