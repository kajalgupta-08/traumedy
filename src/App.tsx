import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Guidelines from "./pages/Guidelines";
import TopicSelection from "./pages/TopicSelection";
import Chat from "./pages/Chat";
import VideoCall from "./pages/VideoCall";
import NotFound from "./pages/NotFound";
import WaitingRoom from "./pages/WaitingRoom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guidelines" element={<Guidelines />} />
<<<<<<< HEAD
          <Route path="/topics" element={<TopicSelection />} />
=======
          <Route path="/chat" element={<Chat />} />
>>>>>>> 874c9aae0a585a09354bfe30c9b26763f06da160
          <Route path="/waiting" element={<WaitingRoom />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/room/:roomId" element={<Chat />} />
          <Route path="/video/:roomId" element={<VideoCall />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
