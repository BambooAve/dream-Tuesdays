import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceRecorder } from "./VoiceRecorder/VoiceRecorder";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  isLoading: boolean;
  sessionId: string;
}

export const ChatInput = ({ 
  input, 
  setInput, 
  handleSendMessage, 
  isLoading,
  sessionId 
}: ChatInputProps) => {
  const handleTranscription = (text: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + text);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
      <div className="max-w-2xl mx-auto flex gap-2">
        <VoiceRecorder
          sessionId={sessionId}
          onTranscription={handleTranscription}
          disabled={isLoading}
        />
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