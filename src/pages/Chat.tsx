import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "text";

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} title="Traumedy" />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[hsl(var(--traumedy-text))] mb-4">
            {mode === "video" ? "Video Call" : "Chat"}
          </h1>
          <p className="text-[hsl(var(--traumedy-text-muted))] mb-8">
            Welcome to the community space. Connect with others who understand your journey.
          </p>
          
          <div className="traumedy-card p-8">
            <p className="text-[hsl(var(--traumedy-text-muted))]">
              {mode === "video" 
                ? "Video call functionality would be implemented here." 
                : "Chat functionality would be implemented here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;