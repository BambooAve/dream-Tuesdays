import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Mic } from "lucide-react";
import { ParticleBackground } from "./ParticleBackground";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  role: "assistant" | "user";
  created_at: string;
}

interface Session {
  id: string;
  progress: number;
}

export const VividVisionChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/");
      return;
    }

    // Check for existing incomplete session
    const { data: existingSession } = await supabase
      .from("vivid_vision_sessions")
      .select()
      .is("completed_at", null)
      .eq("user_id", user.id)
      .single();

    if (existingSession) {
      setSession(existingSession);
      // Load existing messages
      const { data: existingMessages } = await supabase
        .from("vivid_vision_messages")
        .select()
        .eq("session_id", existingSession.id)
        .order("created_at", { ascending: true });
      
      if (existingMessages) {
        setMessages(existingMessages);
      }
    } else {
      // Create new session
      const { data: newSession } = await supabase
        .from("vivid_vision_sessions")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (newSession) {
        setSession(newSession);
        // Send initial message
        sendAssistantMessage("Welcome to your Vivid Vision journey! Let's start crafting your future vision. First, tell me what brings you here today?");
      }
    }
  };

  const sendAssistantMessage = async (content: string) => {
    if (!session) return;

    const newMessage = {
      session_id: session.id,
      content,
      role: "assistant" as const,
    };

    const { data: message } = await supabase
      .from("vivid_vision_messages")
      .insert(newMessage)
      .select()
      .single();

    if (message) {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !session) return;

    setIsLoading(true);
    const userMessage = {
      session_id: session.id,
      content: input,
      role: "user" as const,
    };

    // Save user message
    const { data: message } = await supabase
      .from("vivid_vision_messages")
      .insert(userMessage)
      .select()
      .single();

    if (message) {
      setMessages(prev => [...prev, message]);
      setInput("");

      // Update progress (simplified for now)
      const newProgress = Math.min(session.progress + 10, 100);
      await supabase
        .from("vivid_vision_sessions")
        .update({ progress: newProgress })
        .eq("id", session.id);
      
      setSession(prev => prev ? { ...prev, progress: newProgress } : null);

      // TODO: Add AI response logic here
      // For now, just send a placeholder response
      await sendAssistantMessage("Thank you for sharing. Let's explore that further...");
    }

    setIsLoading(false);
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice Input",
      description: "Voice input feature coming soon!",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 text-white overflow-hidden">
      <ParticleBackground />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 z-10">
        <Progress value={session?.progress || 0} className="h-2 bg-white/10" />
        <p className="text-sm text-white/60 mt-2 text-center">
          Vision Progress: {session?.progress || 0}%
        </p>
      </div>

      {/* Chat Messages */}
      <div className="absolute inset-0 pt-20 pb-24 overflow-y-auto px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 animate-fade-in ${
                  message.role === "assistant"
                    ? "bg-teal/10 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={handleVoiceInput}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-teal hover:bg-teal/90"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};