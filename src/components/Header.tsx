import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header = ({ showBackButton = false, title }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-6 bg-[hsl(var(--traumedy-dark))]">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[hsl(var(--traumedy-darker))] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[hsl(var(--traumedy-text))]" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--traumedy-blue))] to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <span className="text-[hsl(var(--traumedy-text))] font-semibold text-lg">
            {title || "Traumedy"}
          </span>
        </div>
      </div>
      
      <div className="w-10 h-10 bg-[hsl(var(--traumedy-darker))] rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;