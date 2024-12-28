import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ParticleBackground } from "./ParticleBackground";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ProgressBar } from "./ProgressBar";
import { Message, Session } from "@/types/supabase";

export const VividVisionChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      .maybeSingle();

    if (existingSession) {
      setSession(existingSession as Session);
      // Load existing messages
      const { data: existingMessages } = await supabase
        .from("vivid_vision_messages")
        .select()
        .eq("session_id", existingSession.id)
        .order("created_at", { ascending: true });
      
      if (existingMessages) {
        setMessages(existingMessages as Message[]);
      }
    } else {
      // Create new session
      const { data: newSession } = await supabase
        .from("vivid_vision_sessions")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (newSession) {
        setSession(newSession as Session);
        // Send initial message
        sendAssistantMessage("Welcome to your Vivid Vision journey! Let's start crafting your future vision. First, tell me what brings you here today?");
      }
    }
  };

  const sendAssistantMessage = async (content: string) => {
    if (!session) return;

    const { data: message } = await supabase
      .from("vivid_vision_messages")
      .insert({
        session_id: session.id,
        content,
        role: "assistant" as const,
      })
      .select()
      .single();

    if (message) {
      setMessages(prev => [...prev, message as Message]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !session) return;

    setIsLoading(true);
    const { data: message } = await supabase
      .from("vivid_vision_messages")
      .insert({
        session_id: session.id,
        content: input,
        role: "user" as const,
      })
      .select()
      .single();

    if (message) {
      setMessages(prev => [...prev, message as Message]);
      setInput("");

      // Update progress
      const newProgress = Math.min(session.progress + 10, 100);
      await supabase
        .from("vivid_vision_sessions")
        .update({ progress: newProgress })
        .eq("id", session.id);
      
      setSession(prev => prev ? { ...prev, progress: newProgress } : null);

      // TODO: Add AI response logic here
      await sendAssistantMessage("Thank you for sharing. Let's explore that further...");
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 text-white overflow-hidden">
      <ParticleBackground />
      {session && <ProgressBar progress={session.progress} />}
      <ChatMessages messages={messages} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};