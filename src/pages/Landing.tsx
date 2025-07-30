import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[hsl(var(--traumedy-blue))] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-[hsl(var(--traumedy-text))] font-semibold text-lg">
            Stitch Design
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* Hero Image */}
          <div className="mb-8">
            <div className="w-full h-64 bg-gradient-to-r from-blue-300 via-purple-200 to-pink-200 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"
                alt="Peaceful mountain landscape at sunset"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[hsl(var(--traumedy-text))] mb-12">
            Find Connection in Shared Stories
          </h1>

          {/* Action Buttons */}
          <div className="space-y-4 max-w-sm mx-auto">
            <Button
              onClick={() => navigate("/guidelines?type=anonymous")}
              className="w-full py-4 bg-[hsl(var(--traumedy-darker))] hover:bg-[hsl(var(--traumedy-border))] text-[hsl(var(--traumedy-text-muted))] border border-[hsl(var(--traumedy-border))] rounded-lg transition-colors"
              variant="outline"
            >
              Anonymous Access
            </Button>
            
            <Button
              onClick={() => navigate("/signup")}
              className="w-full py-4 traumedy-button font-medium"
            >
              Sign Up
            </Button>
            
            <Button
              onClick={() => navigate("/login")}
              className="w-full py-4 traumedy-button font-medium"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;