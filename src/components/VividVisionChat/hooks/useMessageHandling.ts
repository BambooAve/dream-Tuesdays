import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message, Session } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

export const useMessageHandling = (
  session: Session | null,
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  updateSessionProgress: (sessionId: string, progress: number) => Promise<void>,
  completeSession: (sessionId: string) => Promise<void>
) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim() || !session || isLoading) return;

    setIsLoading(true);
    try {
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
        setMessages([...messages, userMessage as Message]);
        setInput("");

        const { data, error } = await supabase.functions.invoke('vivid-vision-chat', {
          body: {
            messages: messages.concat(userMessage as Message).map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          },
        });

        if (error) throw new Error('Failed to get AI response');

        const newProgress = Math.min(session.progress + 10, 100);
        await updateSessionProgress(session.id, newProgress);

        setTimeout(() => {
          setTypingMessage(data.content);
        }, 1000);

        if (newProgress === 100) {
          await completeSession(session.id);
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

  const handleTypingComplete = async () => {
    if (!session || !typingMessage) return;

    const { data: message } = await supabase
      .from("vivid_vision_messages")
      .insert({
        session_id: session.id,
        content: typingMessage,
        role: "assistant" as const,
      })
      .select()
      .single();

    if (message) {
      setMessages([...messages, message as Message]);
      setTypingMessage(null);
    }
  };

  return {
    input,
    setInput,
    isLoading,
    typingMessage,
    setTypingMessage,
    handleSendMessage,
    handleTypingComplete,
  };
};