import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceRecorder } from "./VoiceRecorder/VoiceRecorder";
import { AudioWaveform, Loader2 } from "lucide-react";

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
        >
          {(isRecording, isProcessing) => (
            <>
              {isRecording ? (
                <div className="flex-1 bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 16 + 8}px`,
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-white/60 text-sm">Recording...</span>
                </div>
              ) : isProcessing ? (
                <div className="flex-1 bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-teal" />
                  <span className="text-white/60 text-sm">Processing audio...</span>
                </div>
              ) : (
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              )}
            </>
          )}
        </VoiceRecorder>
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