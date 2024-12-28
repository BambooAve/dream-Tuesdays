import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ProgressBar } from "./ProgressBar";
import { ChatCompletion } from "./ChatCompletion";
import { WelcomeScreen } from "./WelcomeScreen";
import { Message, Session } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

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

  const handleStartChat = async (introMessage: string) => {
    setHasStarted(true);
    
    // First send the user's introduction
    if (session) {
      const { data: userMessage } = await supabase
        .from("vivid_vision_messages")
        .insert({
          session_id: session.id,
          content: introMessage,
          role: "user" as const,
        })
        .select()
        .single();

      if (userMessage) {
        setMessages(prev => [...prev, userMessage as Message]);
        
        // Then send the assistant's response
        await sendAssistantMessage(
          "Thank you for sharing! I'm excited to help you create your vivid vision. " +
          "Let's start crafting your future vision. What area of your life would you like to focus on first?"
        );
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

        // If this is the final message (progress is 100%), mark the session as completed
        if (newProgress === 100) {
          await supabase
            .from("vivid_vision_sessions")
            .update({ completed_at: new Date().toISOString() })
            .eq("id", session.id);
        }
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

  // Check if the chat is complete
  const isChatComplete = messages.length > 0 && 
    messages[messages.length - 1].role === 'assistant' && 
    messages[messages.length - 1].content.includes("I'm now working on creating your final Vivid Vision goals");

  if (!hasStarted) {
    return <WelcomeScreen onStart={handleStartChat} />;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      {session && <ProgressBar progress={session.progress} />}
      <ChatMessages messages={messages} />
      {isChatComplete ? (
        <ChatCompletion sessionId={session?.id || ''} messages={messages} />
      ) : (
        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
