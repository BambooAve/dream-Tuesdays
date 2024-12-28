import { Message } from "@/types/supabase";

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
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
      </div>
    </div>
  );
};