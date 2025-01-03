import { Message } from "@/types/supabase";
import { TypingAnimation } from "./TypingAnimation";
import { format } from "date-fns";

interface ChatMessagesProps {
  messages: Message[];
  typingMessage: string | null;
  onTypingComplete: () => void;
}

export const ChatMessages = ({ messages, typingMessage, onTypingComplete }: ChatMessagesProps) => {
  return (
    <div className="flex flex-col h-[calc(100vh-88px)] pt-20">
      <div className="flex-1 overflow-y-auto px-4 pb-4 messages-container">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => {
            const showTimestamp = index === 0 || 
              new Date(message.created_at).getTime() - 
              new Date(messages[index - 1].created_at).getTime() > 300000; // 5 minutes

            return (
              <div key={message.id} className="space-y-2">
                {showTimestamp && (
                  <div className="text-center">
                    <span className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full">
                      {format(new Date(message.created_at), "MMM d, h:mm aa")}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg ${
                      message.role === "assistant"
                        ? "bg-brand-orange text-white rounded-bl-none"
                        : "bg-white text-black rounded-br-none"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
          {typingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-5 py-3 shadow-lg bg-brand-orange text-white rounded-bl-none">
                <TypingAnimation 
                  content={typingMessage} 
                  onComplete={onTypingComplete}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};