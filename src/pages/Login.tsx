import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // After login, redirect to guidelines
    navigate("/guidelines?type=user");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--traumedy-darkest))] flex flex-col">
      <Header showBackButton={true} />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Title */}
          <h1 className="text-3xl font-bold text-[hsl(var(--traumedy-text))] text-center mb-8">
            Welcome back
          </h1>

          {/* Tab Switcher */}
          <div className="flex mb-6 bg-[hsl(var(--traumedy-darker))] rounded-lg p-1">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))]"
                  : "text-[hsl(var(--traumedy-text-muted))] hover:text-[hsl(var(--traumedy-text))]"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                navigate("/signup");
              }}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === "signup"
                  ? "bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))]"
                  : "text-[hsl(var(--traumedy-text-muted))] hover:text-[hsl(var(--traumedy-text))]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full py-4 px-4 traumedy-input placeholder:text-[hsl(var(--traumedy-text-muted))]"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-4 px-4 traumedy-input placeholder:text-[hsl(var(--traumedy-text-muted))]"
                required
              />
            </div>

            <div className="text-left">
              <button
                type="button"
                className="text-[hsl(var(--traumedy-text-muted))] hover:text-[hsl(var(--traumedy-text))] text-sm transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-4 traumedy-button font-medium text-lg"
            >
              Log In
            </Button>
          </form>

          {/* Anonymous Access Option */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/guidelines?type=anonymous")}
              className="text-[hsl(var(--traumedy-text-muted))] hover:text-[hsl(var(--traumedy-text))] text-sm transition-colors"
            >
              Or proceed anonymously
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;