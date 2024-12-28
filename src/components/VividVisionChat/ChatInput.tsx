import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ input, setInput, handleSendMessage, isLoading }: ChatInputProps) => {
  const { toast } = useToast();

  const handleVoiceInput = () => {
    toast({
      title: "Voice Input",
      description: "Voice input feature coming soon!",
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
      <div className="max-w-2xl mx-auto flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={handleVoiceInput}
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-teal hover:bg-teal/90"
        >
          Send
        </Button>
      </div>
    </div>
  );
};