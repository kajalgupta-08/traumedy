import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";

const socket = io("http://localhost:5000");

const WaitingRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topic, mode } = location.state || {};
  const [status, setStatus] = useState("Looking for someone to talk with...");
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    if (!topic || !mode) {
      alert("Missing topic or mode. Redirecting back.");
      navigate("/guidelines");
      return;
    }

    const email = localStorage.getItem("email") || `Anonymous${Math.floor(Math.random() * 1000)}`;
    
    // Join waiting room
    socket.emit("joinWaitingRoom", { user: email, topic, mode });
    setStatus(`Looking for someone interested in ${topic}...`);

    // Start timer
    const timer = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    // Listen for match
    socket.on("matched", ({ roomId, partner }) => {
      setStatus("Match found! Connecting...");
      clearInterval(timer);
      setTimeout(() => {
        const route = mode === 'video' ? `/video/${roomId}` : `/room/${roomId}`;
        navigate(route);
      }, 1000);
    });

    return () => {
      socket.off("matched");
      clearInterval(timer);
    };
  }, [navigate, topic, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTopicDisplay = (topic: string) => {
    const topicMap: { [key: string]: string } = {
      anxiety: "Anxiety & Panic",
      depression: "Depression & Mood", 
      stress: "Stress & Burnout",
      trauma: "Trauma & PTSD",
      grief: "Grief & Loss",
      abuse: "Abuse & Recovery",
      relationships: "Relationships",
      general: "General Support"
    };
    return topicMap[topic] || topic;
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} title="Finding Support" />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-[hsl(var(--traumedy-primary))] animate-spin" />
            </div>
            
            <h1 className="text-2xl font-bold text-[hsl(var(--traumedy-text))]">
              {status}
            </h1>
            
            <div className="space-y-2 text-[hsl(var(--traumedy-text-muted))]">
              <p>Topic: <span className="text-[hsl(var(--traumedy-primary))]">{getTopicDisplay(topic)}</span></p>
              <p>Mode: <span className="text-[hsl(var(--traumedy-primary))]">{mode === 'text' ? 'Text Chat' : 'Video Call'}</span></p>
              <p>Wait time: <span className="text-[hsl(var(--traumedy-primary))]">{formatTime(waitTime)}</span></p>
            </div>
          </div>

          <div className="traumedy-card p-6">
            <h3 className="font-semibold text-[hsl(var(--traumedy-text))] mb-3">
              While you wait...
            </h3>
            <div className="text-sm text-[hsl(var(--traumedy-text-muted))] space-y-2">
              <p>• Take deep breaths and stay present</p>
              <p>• Remember you're taking a brave step</p>
              <p>• This is a safe, anonymous space</p>
              <p>• Help is on the way</p>
            </div>
          </div>

          <p className="text-xs text-[hsl(var(--traumedy-text-muted))]">
            If no match is found within 5 minutes, you'll be connected with general support
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;