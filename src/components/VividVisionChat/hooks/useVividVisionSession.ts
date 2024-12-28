import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Message, Session } from "@/types/supabase";

export const useVividVisionSession = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
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

    const { data: existingSession } = await supabase
      .from("vivid_vision_sessions")
      .select()
      .is("completed_at", null)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingSession) {
      setSession(existingSession as Session);
      
      const { data: existingMessages } = await supabase
        .from("vivid_vision_messages")
        .select()
        .eq("session_id", existingSession.id)
        .order("created_at", { ascending: true });
      
      if (existingMessages && existingMessages.length > 0) {
        setMessages(existingMessages as Message[]);
        setHasStarted(true);
      }
    }
  };

  const updateSessionProgress = async (sessionId: string, newProgress: number) => {
    await supabase
      .from("vivid_vision_sessions")
      .update({ progress: newProgress })
      .eq("id", sessionId);
    
    setSession(prev => prev ? { ...prev, progress: newProgress } : null);
  };

  const completeSession = async (sessionId: string) => {
    await supabase
      .from("vivid_vision_sessions")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", sessionId);
  };

  return {
    messages,
    setMessages,
    session,
    setSession,
    hasStarted,
    setHasStarted,
    updateSessionProgress,
    completeSession,
  };
};