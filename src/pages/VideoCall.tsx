import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  MessageCircle,
  Send,
  Users
} from "lucide-react";
import Header from "@/components/Header";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:5000");

interface Message {
  sender: string;
  text: string;
  userId: string;
}

const VideoCall = () => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`);
  const [userId] = useState(uuidv4());
  const [roomId, setRoomId] = useState<string | null>(paramRoomId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participants] = useState([
    { id: 1, name: "You", status: "connected", avatar: "🟢" },
    { id: 2, name: "Anonymous", status: "connected", avatar: "🟢" },
    { id: 3, name: "Support", status: "connected", avatar: "🟢" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

    // Initialize local video
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Error accessing media devices:", err));

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

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const endCall = () => navigate('/guidelines');

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} title="Video Support Session" />

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 p-4 grid grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="relative bg-[hsl(var(--traumedy-dark))] rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              {isVideoOff && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl">👤</div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                You {isMuted && "🔇"}
              </div>
            </div>

            {/* Remote Video */}
            <div className="relative bg-[hsl(var(--traumedy-dark))] rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl">👤</div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Anonymous
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 flex justify-center gap-4">
            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
              className={`rounded-full w-12 h-12 ${isMuted ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Button
              onClick={toggleVideo}
              variant="outline"
              size="lg"
              className={`rounded-full w-12 h-12 ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>

            <Button
              onClick={() => setShowChat(!showChat)}
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            <Button
              onClick={endCall}
              variant="destructive"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-[hsl(var(--traumedy-darker))] border-l border-[hsl(var(--traumedy-border))] flex flex-col">
          {/* Participants */}
          <div className="p-4 border-b border-[hsl(var(--traumedy-border))]">
            <h3 className="text-[hsl(var(--traumedy-text))] font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Participants ({participants.length})
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3">
                  <span className="text-lg">{participant.avatar}</span>
                  <div className="flex-1">
                    <p className="text-[hsl(var(--traumedy-text))] text-sm">{participant.name}</p>
                    <p className="text-[hsl(var(--traumedy-text-muted))] text-xs">{participant.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          {showChat && (
            <>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <p className="text-center text-[hsl(var(--traumedy-text-muted))] text-sm">
                      Start a conversation...
                    </p>
                  )}

                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          msg.sender === "System"
                            ? "bg-[hsl(var(--traumedy-border))] text-[hsl(var(--traumedy-text-muted))]"
                            : msg.sender === "You"
                            ? "bg-[hsl(var(--traumedy-primary))] text-white"
                            : "bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))]"
                        }`}
                      >
                        {msg.sender !== "System" && (
                          <p className="text-xs opacity-70 mb-1">{msg.sender}</p>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 border-t border-[hsl(var(--traumedy-border))] flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={!roomId}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="bg-[hsl(var(--traumedy-dark))] border-[hsl(var(--traumedy-border))] text-[hsl(var(--traumedy-text))]"
                />
                <Button onClick={sendMessage} disabled={!roomId} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;