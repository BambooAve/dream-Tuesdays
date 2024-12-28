import { Message } from "@/types/supabase";
import { TypingAnimation } from "./TypingAnimation";

interface ChatMessagesProps {
  messages: Message[];
  typingMessage: string | null;
  onTypingComplete: () => void;
}

export const ChatMessages = ({ messages, typingMessage, onTypingComplete }: ChatMessagesProps) => {
  return (
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
        {typingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2 animate-fade-in bg-teal/10 text-white">
              <TypingAnimation 
                content={typingMessage} 
                onComplete={onTypingComplete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};