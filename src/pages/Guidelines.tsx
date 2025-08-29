import { useNavigate } from "react-router-dom";
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

  const handleAgree = () => {
    navigate("/topics");
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

          {/* Action Button */}
          <div className="text-center">
            <Button
              onClick={handleAgree}
              className="w-full py-4 traumedy-button font-medium text-lg"
            >
              I Agree & Continue
            </Button>
            <p className="text-[hsl(var(--traumedy-text-muted))] text-sm mt-2">
              By clicking "I Agree", you accept our community guidelines and terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
