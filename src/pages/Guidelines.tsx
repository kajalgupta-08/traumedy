import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Clock,
  MessageCircle,
  FileText,
  Settings,
} from "lucide-react";
import Header from "@/components/Header";

const Guidelines = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type") || "anonymous";

  // State for topic and mode
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("");

  const guidelines = [
    {
      icon: Users,
      title: "Respect Others' Experiences",
      description:
        "Share your stories and listen to others with empathy and understanding.",
    },
    {
      icon: Clock,
      title: "Are you above 18?",
      description:
        "Only use this website if you're about 18 years of age.",
    },
    {
      icon: Shield,
      title: "Maintain Anonymity",
      description:
        "Protect your identity and the privacy of others. Do not share personal information.",
    },
    {
      icon: Settings,
      title: "No Harassment or Discrimination",
      description:
        "Engage in respectful dialogue. Avoid offensive language, personal attacks, and bullying.",
    },
    {
      icon: FileText,
      title: "Content Appropriateness",
      description:
        "Keep discussions relevant to trauma and recovery. Avoid unrelated or inappropriate content.",
    },
    {
      icon: MessageCircle,
      title: "No Spam or Self-Promotion",
      description:
        "Do not promote products, services, or external links without permission.",
    },
    {
      icon: Users,
      title: "Seek Professional Help When Needed",
      description:
        "If you or someone close is in immediate danger, seek professional help. This app is not a substitute for therapy.",
    },
  ];

  const handleAgree = async () => {
  const email = localStorage.getItem("email");

  if (!topic || !mode) {
    alert("Please select a topic and mode before proceeding.");
    return;
  }

  if (!email) {
    alert("Email not found. Please log in again.");
    return;
  }

  // 🔹 Log the data being sent
  console.log("Sending match request:", { email, topic, mode });

  try {
    const res = await fetch("http://localhost:5000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, topic, mode }),
    });

    // 🔹 Log the response status
    console.log("Match API status:", res.status);

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    // 🔹 Log the response data
    console.log("Match API Response:", data);

    if (data.matched) {
      navigate(`/room/${data.roomId}`);
    } else {
      navigate("/waiting", { state: { topic, mode } });
    }
  } catch (err) {
    console.error("Error matching:", err);
    alert("There was an error connecting to the match server.");
  }
};



  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[hsl(var(--traumedy-text))] text-center mb-8">
            Community Guidelines
          </h1>

          {/* Guidelines List */}
          <div className="space-y-4 mb-8">
            {guidelines.map((guideline, index) => {
              const IconComponent = guideline.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 traumedy-card"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[hsl(var(--traumedy-dark))] rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[hsl(var(--traumedy-text-muted))]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[hsl(var(--traumedy-text))] mb-1">
                      {guideline.title}
                    </h3>
                    <p className="text-sm text-[hsl(var(--traumedy-text-muted))] leading-relaxed">
                      {guideline.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Topic Selection */}
          <div className="mb-4">
            <label className="block mb-2 text-[hsl(var(--traumedy-text))]">
              Select Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 rounded-lg bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))] border border-[hsl(var(--traumedy-border))]"
            >
              <option value="">-- Choose a Topic --</option>
              <option value="loss">Loss</option>
              <option value="abuse">Abuse</option>
              <option value="anxiety">Anxiety</option>
            </select>
          </div>

          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block mb-2 text-[hsl(var(--traumedy-text))]">
              Select Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 rounded-lg bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))] border border-[hsl(var(--traumedy-border))]"
            >
              <option value="">-- Choose a Mode --</option>
              <option value="text">Text Chat</option>
              <option value="video">Video Call</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleAgree}
              className="w-full py-4 traumedy-button font-medium text-lg"
            >
              I Agree
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => setMode("text")}
                className="flex-1 py-4 bg-[hsl(var(--traumedy-darker))] hover:bg-[hsl(var(--traumedy-border))] text-[hsl(var(--traumedy-text))] border border-[hsl(var(--traumedy-border))] rounded-lg transition-colors"
                variant="outline"
              >
                Chat
              </Button>
              <Button
                onClick={() => setMode("video")}
                className="flex-1 py-4 bg-[hsl(var(--traumedy-darker))] hover:bg-[hsl(var(--traumedy-border))] text-[hsl(var(--traumedy-text))] border border-[hsl(var(--traumedy-border))] rounded-lg transition-colors"
                variant="outline"
              >
                Video Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
