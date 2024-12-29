import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Message } from "@/types/supabase";
import { logConversation } from "./utils/conversationLogger";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatCompletionProps {
  sessionId: string;
  messages: Message[];
}

export const ChatCompletion = ({ sessionId, messages }: ChatCompletionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processCompletion = async () => {
      try {
        // First log the conversation as before
        await logConversation(sessionId, messages);

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Process the chat completion to extract goals and generate vivid vision
        const { data, error } = await supabase.functions.invoke('process-chat-completion', {
          body: { sessionId, userId: user.id },
        });

        if (error) throw error;

        toast({
          title: "Vision Created",
          description: `Successfully created ${data.goalsCreated} goals and generated your vivid vision.`,
        });

      } catch (error) {
        console.error('Error processing chat completion:', error);
        toast({
          title: "Error",
          description: "Failed to process vision and goals from conversation. Please try again.",
          variant: "destructive",
        });
      }
    };

    processCompletion();
  }, [sessionId, messages, toast]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center items-center bg-gradient-to-t from-black to-transparent">
      <Button
        onClick={() => navigate('/profile')}
        size="lg"
        className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-full"
      >
        View Your Vision Board
      </Button>
    </div>
  );
};