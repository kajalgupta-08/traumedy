import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

const Signup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Simple validation for demo - in production use proper authentication
    if (formData.email && formData.password && formData.username) {
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("email", formData.email);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } else {
      alert("Please fill in all fields");
    }
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
          <h1 className="text-3xl font-bold text-[hsl(var(--traumedy-text))] text-center mb-8">
            Join our community
          </h1>

          <div className="flex mb-6 bg-[hsl(var(--traumedy-darker))] rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab("login");
                navigate("/login");
              }}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))]"
                  : "text-[hsl(var(--traumedy-text-muted))] hover:text-[hsl(var(--traumedy-text))]"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === "signup"
                  ? "bg-[hsl(var(--traumedy-dark))] text-[hsl(var(--traumedy-text))]"
                  : "text-[hsl(var(--traumedy-text-muted))] hover:text-[hsl(var(--traumedy-text))]"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full py-4 px-4 traumedy-input placeholder:text-[hsl(var(--traumedy-text-muted))]"
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full py-4 px-4 traumedy-input placeholder:text-[hsl(var(--traumedy-text-muted))]"
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full py-4 px-4 traumedy-input placeholder:text-[hsl(var(--traumedy-text-muted))]"
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full py-4 px-4 traumedy-input placeholder:text-[hsl(var(--traumedy-text-muted))]"
              required
            />
            <Button
              type="submit"
              className="w-full py-4 traumedy-button font-medium text-lg"
            >
              Sign Up
            </Button>
          </form>

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

export default Signup;
