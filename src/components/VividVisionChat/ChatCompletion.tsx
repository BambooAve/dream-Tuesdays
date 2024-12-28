import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Message } from "@/types/supabase";
import { logConversation } from "./utils/conversationLogger";
import { useEffect } from "react";

interface ChatCompletionProps {
  sessionId: string;
  messages: Message[];
}

export const ChatCompletion = ({ sessionId, messages }: ChatCompletionProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    logConversation(sessionId, messages);
  }, [sessionId, messages]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center items-center bg-gradient-to-t from-black to-transparent">
      <Button
        onClick={() => navigate('/account')}
        size="lg"
        className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-full"
      >
        View Your Vision Board
      </Button>
    </div>
  );
};