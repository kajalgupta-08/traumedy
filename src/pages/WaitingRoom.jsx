import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Users, Clock, MessageCircle } from "lucide-react";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topic, mode } = location.state || {};
  const [status, setStatus] = useState("Looking for someone to talk to...");
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem("email") || `User${Math.floor(Math.random() * 1000)}`;
    
    if (!topic || !mode) {
      alert("Missing topic or mode. Redirecting back.");
      navigate("/topics");
      return;
    }

    // Start wait timer
    const timer = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    // Fast polling approach - check for matches every 500ms
    const checkForMatch = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, topic, mode }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.matched) {
            setStatus("Match found! Connecting...");
            clearInterval(timer);
            clearInterval(pollInterval);
            navigate(`/room/${data.roomId}`);
          }
        }
      } catch (error) {
        console.error("Error checking for match:", error);
      }
    };

    // Initial match attempt
    checkForMatch();
    
    // Poll every 500ms for faster matching
    const pollInterval = setInterval(checkForMatch, 500);

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [navigate, topic, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTopicDisplay = (topicId) => {
    const topicMap = {
      loss: "Loss & Grief",
      abuse: "Abuse & Violence", 
      anxiety: "Anxiety & Depression",
      family: "Family Issues",
      childhood: "Childhood Trauma",
      workplace: "Workplace Trauma"
    };
    return topicMap[topicId] || topicId;
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[hsl(var(--traumedy-border))]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[hsl(var(--traumedy-primary))] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-8 h-8 text-[hsl(var(--traumedy-primary))]" />
              </div>
            </div>
          </div>

          {/* Status */}
          <h1 className="text-2xl font-bold text-[hsl(var(--traumedy-text))] mb-2">
            {status}
          </h1>
          <p className="text-[hsl(var(--traumedy-text-muted))] mb-8">
            We're finding someone who wants to discuss the same topic as you
          </p>

          {/* Topic Info */}
          <div className="bg-[hsl(var(--traumedy-darker))] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-[hsl(var(--traumedy-primary))]" />
              <span className="text-[hsl(var(--traumedy-text))] font-medium">
                {getTopicDisplay(topic)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[hsl(var(--traumedy-text-muted))]" />
              <span className="text-[hsl(var(--traumedy-text-muted))] text-sm">
                Waiting: {formatTime(waitTime)}
              </span>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[hsl(var(--traumedy-dark))] rounded-lg p-4 mb-6">
            <h3 className="text-[hsl(var(--traumedy-text))] font-medium mb-2">
              While you wait...
            </h3>
            <ul className="text-[hsl(var(--traumedy-text-muted))] text-sm space-y-1">
              <li>• Take a deep breath and prepare your thoughts</li>
              <li>• Remember to be respectful and empathetic</li>
              <li>• You can end the conversation at any time</li>
            </ul>
          </div>

          {/* Cancel Button */}
          <Button
            onClick={() => navigate("/topics")}
            variant="outline"
            className="w-full py-3 bg-[hsl(var(--traumedy-darker))] hover:bg-[hsl(var(--traumedy-border))] text-[hsl(var(--traumedy-text))] border border-[hsl(var(--traumedy-border))]"
          >
            Choose Different Topic
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
