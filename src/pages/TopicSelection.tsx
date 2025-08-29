import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import {
  Heart,
  Shield,
  Brain,
  Users,
  Home,
  Briefcase,
  MessageCircle,
  Video,
} from "lucide-react";

const TopicSelection = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  const topics = [
    {
      id: "loss",
      title: "Loss & Grief",
      description: "Dealing with the loss of loved ones, relationships, or life changes",
      icon: Heart,
      color: "bg-red-500/10 border-red-500/20",
    },
    {
      id: "abuse",
      title: "Abuse & Violence",
      description: "Physical, emotional, or psychological abuse experiences",
      icon: Shield,
      color: "bg-orange-500/10 border-orange-500/20",
    },
    {
      id: "anxiety",
      title: "Anxiety & Depression",
      description: "Mental health struggles, panic attacks, and emotional challenges",
      icon: Brain,
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "family",
      title: "Family Issues",
      description: "Family conflicts, divorce, parental issues, and relationship problems",
      icon: Users,
      color: "bg-green-500/10 border-green-500/20",
    },
    {
      id: "childhood",
      title: "Childhood Trauma",
      description: "Early life experiences and their lasting effects",
      icon: Home,
      color: "bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "workplace",
      title: "Workplace Trauma",
      description: "Work-related stress, harassment, or traumatic incidents",
      icon: Briefcase,
      color: "bg-yellow-500/10 border-yellow-500/20",
    },
  ];

  const modes = [
    {
      id: "text",
      title: "Text Chat",
      description: "Connect through written messages",
      icon: MessageCircle,
    },
    {
      id: "video",
      title: "Video Call",
      description: "Face-to-face conversation (optional)",
      icon: Video,
    },
  ];

  const handleProceed = () => {
    if (!selectedTopic || !selectedMode) {
      alert("Please select both a topic and communication mode before proceeding.");
      return;
    }

    // Create shared room ID based on topic and mode only
    const roomId = `${selectedTopic}-${selectedMode}`;
    
    // Go directly to shared chat room
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[hsl(var(--traumedy-text))] text-center mb-2">
            Choose Your Topic
          </h1>
          <p className="text-[hsl(var(--traumedy-text-muted))] text-center mb-8">
            Select what you'd like to talk about and how you'd prefer to connect
          </p>

          {/* Topic Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[hsl(var(--traumedy-text))] mb-4">
              What would you like to discuss?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => {
                const IconComponent = topic.icon;
                return (
                  <Card
                    key={topic.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedTopic === topic.id
                        ? "ring-2 ring-[hsl(var(--traumedy-primary))] bg-[hsl(var(--traumedy-dark))]"
                        : "bg-[hsl(var(--traumedy-darker))] hover:bg-[hsl(var(--traumedy-dark))]"
                    } border-[hsl(var(--traumedy-border))]`}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-lg ${topic.color} flex items-center justify-center mb-2`}>
                        <IconComponent className="w-6 h-6 text-[hsl(var(--traumedy-text))]" />
                      </div>
                      <CardTitle className="text-[hsl(var(--traumedy-text))] text-lg">
                        {topic.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-[hsl(var(--traumedy-text-muted))] text-sm">
                        {topic.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[hsl(var(--traumedy-text))] mb-4">
              How would you like to connect?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <Card
                    key={mode.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedMode === mode.id
                        ? "ring-2 ring-[hsl(var(--traumedy-primary))] bg-[hsl(var(--traumedy-dark))]"
                        : "bg-[hsl(var(--traumedy-darker))] hover:bg-[hsl(var(--traumedy-dark))]"
                    } border-[hsl(var(--traumedy-border))]`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--traumedy-primary))]/10 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-[hsl(var(--traumedy-primary))]" />
                        </div>
                        <div>
                          <CardTitle className="text-[hsl(var(--traumedy-text))] text-lg">
                            {mode.title}
                          </CardTitle>
                          <CardDescription className="text-[hsl(var(--traumedy-text-muted))] text-sm">
                            {mode.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Proceed Button */}
          <div className="text-center">
            <Button
              onClick={handleProceed}
              disabled={!selectedTopic || !selectedMode}
              className="px-8 py-4 traumedy-button font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find Someone to Talk To
            </Button>
            {(!selectedTopic || !selectedMode) && (
              <p className="text-[hsl(var(--traumedy-text-muted))] text-sm mt-2">
                Please select both a topic and communication mode
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
