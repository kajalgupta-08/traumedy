import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Video, Send } from "lucide-react";
import Header from "@/components/Header";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "text";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "System", content: "Welcome! Feel free to share and connect with others who understand.", time: "10:30 AM", isSystem: true }
  ]);

  const anonymousUsers = [
    { id: 1, name: "Anonymous Helper", initials: "AH", status: "online" },
    { id: 2, name: "Community Friend", initials: "CF", status: "online" },
    { id: 3, name: "Supportive Soul", initials: "SS", status: "away" },
    { id: 4, name: "Caring Listener", initials: "CL", status: "online" }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        user: "You",
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: false
      }]);
      setMessage("");
    }
  };

  const handleVideoCall = () => {
    navigate("/chat?mode=video");
  };

  if (mode === "video") {
    return (
      <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
        <Header showBackButton={true} title="Video Call" />
        
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
              {/* Main video area */}
              <div className="lg:col-span-3">
                <div className="traumedy-card h-96 lg:h-full flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-[hsl(var(--traumedy-blue))] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[hsl(var(--traumedy-text))] mb-2">Video Call Ready</h3>
                    <p className="text-[hsl(var(--traumedy-text-muted))]">Connecting you with the community...</p>
                  </div>
                </div>
              </div>

              {/* Participants sidebar */}
              <div className="traumedy-card p-4">
                <h3 className="text-lg font-semibold text-[hsl(var(--traumedy-text))] mb-4">Participants</h3>
                <div className="space-y-3">
                  {anonymousUsers.slice(0, 3).map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[hsl(var(--traumedy-blue))] text-white text-sm">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[hsl(var(--traumedy-text))] truncate">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span className="text-xs text-[hsl(var(--traumedy-text-muted))]">{user.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} title="Community Chat" />
      
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Video call button */}
        <div className="p-4 border-b border-[hsl(var(--traumedy-dark))]">
          <Button 
            onClick={handleVideoCall}
            className="bg-[hsl(var(--traumedy-blue))] hover:bg-[hsl(var(--traumedy-blue))]/90 text-white"
          >
            <Video className="w-4 h-4 mr-2" />
            Start Video Call
          </Button>
        </div>

        <div className="flex-1 flex">
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
              {messages.length === 1 && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[hsl(var(--traumedy-text))] mb-2">Get Started</h2>
                  <p className="text-[hsl(var(--traumedy-text-muted))]">
                    Share your thoughts, connect with others, and find support in our community.
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isSystem 
                        ? 'bg-[hsl(var(--traumedy-blue))]/20 text-[hsl(var(--traumedy-text))]'
                        : msg.user === 'You' 
                          ? 'bg-[hsl(var(--traumedy-blue))] text-white' 
                          : 'bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))]'
                    }`}>
                      {!msg.isSystem && (
                        <p className="text-xs opacity-70 mb-1">{msg.user}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-[hsl(var(--traumedy-dark))]">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-[hsl(var(--traumedy-dark))] border-[hsl(var(--traumedy-darker))] text-[hsl(var(--traumedy-text))]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-[hsl(var(--traumedy-blue))] hover:bg-[hsl(var(--traumedy-blue))]/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Online users sidebar */}
          <div className="w-64 bg-[hsl(var(--traumedy-dark))] border-l border-[hsl(var(--traumedy-darker))] p-4">
            <h3 className="text-lg font-semibold text-[hsl(var(--traumedy-text))] mb-4">Anonymous Community</h3>
            <div className="space-y-3">
              {anonymousUsers.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--traumedy-darker))] transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[hsl(var(--traumedy-blue))] text-white text-sm">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[hsl(var(--traumedy-text))] truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-xs text-[hsl(var(--traumedy-text-muted))]">{user.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;