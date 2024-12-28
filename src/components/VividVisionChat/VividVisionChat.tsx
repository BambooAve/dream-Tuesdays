import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ProgressBar } from "./ProgressBar";
import { Message, Session } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export const VividVisionChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
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
      .maybeSingle();

    if (existingSession) {
      setSession(existingSession as Session);
      
      // Load existing messages
      const { data: existingMessages } = await supabase
        .from("vivid_vision_messages")
        .select()
        .eq("session_id", existingSession.id)
        .order("created_at", { ascending: true });
      
      if (existingMessages && existingMessages.length > 0) {
        setMessages(existingMessages as Message[]);
        setHasStarted(true);
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
      }
    }
  };

  const handleStartChat = async () => {
    setHasStarted(true);
    // Send initial message
    await sendAssistantMessage("Welcome to your Vivid Vision journey! Let's start crafting your future vision. First, tell me what brings you here today?");
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
    if (!input.trim() || !session || isLoading) return;

    setIsLoading(true);
    try {
      // Save user message
      const { data: userMessage } = await supabase
        .from("vivid_vision_messages")
        .insert({
          session_id: session.id,
          content: input,
          role: "user" as const,
        })
        .select()
        .single();

      if (userMessage) {
        setMessages(prev => [...prev, userMessage as Message]);
        setInput("");

        // Get GPT response
        const { data, error } = await supabase.functions.invoke('vivid-vision-chat', {
          body: {
            messages: messages.concat(userMessage as Message).map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          },
        });

        if (error) {
          throw new Error('Failed to get AI response');
        }

        // Update progress
        const newProgress = Math.min(session.progress + 10, 100);
        await supabase
          .from("vivid_vision_sessions")
          .update({ progress: newProgress })
          .eq("id", session.id);
        
        setSession(prev => prev ? { ...prev, progress: newProgress } : null);

        // Save AI response
        await sendAssistantMessage(data.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
          <h1 className="text-4xl font-bold leading-tight">
            Imagine writing down exactly what your dream life looks like 365 days from now—and then actually living it.
          </h1>
          <p className="text-xl text-gray-300">
            That's what we're going to do today.
          </p>
          <div className="space-y-4">
            <p className="text-gray-400">
              This is your time to reflect, dream, and plan. The first step toward transformation is setting your intentions.
            </p>
            <Button 
              onClick={handleStartChat}
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-full"
            >
              Start Chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
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