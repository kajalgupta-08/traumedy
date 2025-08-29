import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Header from "@/components/Header";
import { io } from "socket.io-client";

interface Message {
  sender: string;
  text: string;
  userId: string;
  socketId?: string;
}

const Chat = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mySocketId, setMySocketId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!roomId) return;

    const socket = io("http://localhost:8080");
    socketRef.current = socket;

    socket.on("connect", () => {
      setMySocketId(socket.id);
      socket.emit("joinRoom", { roomId });
    });

    socket.on("message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = () => {
    if (!input.trim() || !roomId || !socketRef.current) return;

    const msg = { 
      sender: "User", 
      text: input, 
      userId: mySocketId,
      socketId: mySocketId,
      roomId 
    };
    
    socketRef.current.emit("sendMessage", msg);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--traumedy-darkest))]">
      <Header showBackButton={true} title="Safe Space Chat" />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-[hsl(var(--traumedy-darker))] border-b border-[hsl(var(--traumedy-border))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-[hsl(var(--traumedy-text))] font-medium">
                Connected - Start chatting!
              </span>
            </div>
            <span className="text-[hsl(var(--traumedy-text-muted))] text-sm">
              Remember: Be respectful and empathetic
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[hsl(var(--traumedy-dark))] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-[hsl(var(--traumedy-text-muted))]" />
                </div>
                <p className="text-[hsl(var(--traumedy-text-muted))] text-lg mb-2">
                  Welcome to your safe space
                </p>
                <p className="text-[hsl(var(--traumedy-text-muted))] text-sm">
                  Start the conversation when you're ready
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isMyMessage = msg.userId === mySocketId || msg.socketId === mySocketId;
              return (
                <div
                  key={idx}
                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-2xl ${
                      msg.sender === "System"
                        ? "bg-gray-600 text-gray-200 text-center mx-auto text-sm"
                        : isMyMessage
                        ? "bg-blue-500 text-white rounded-br-md shadow-lg border-2 border-blue-400"
                        : "bg-emerald-500 text-white rounded-bl-md shadow-lg border-2 border-emerald-400"
                    }`}
                  >
                    {msg.sender !== "System" && !isMyMessage && (
                      <p className="text-xs opacity-70 mb-1 font-medium">Anonymous</p>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-6 bg-[hsl(var(--traumedy-darker))] border-t border-[hsl(var(--traumedy-border))]">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={roomId ? "Share your thoughts..." : "Connecting to your match..."}
              disabled={!roomId}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 py-4 px-4 traumedy-input placeholder:text-[hsl(var(--traumedy-text-muted))] text-[hsl(var(--traumedy-text))]"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!roomId || !input.trim()}
              className="px-6 py-4 traumedy-button disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[hsl(var(--traumedy-text-muted))] text-xs mt-2 text-center">
            Your conversation is private and anonymous
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
