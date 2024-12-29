import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceRecorder } from "./VoiceRecorder/VoiceRecorder";
import { AudioWaveform, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTranscription = (text: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + text);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px'; // Reset height to minimum
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`; // Max height of 120px
      
      // Update the padding bottom of the messages container
      const messagesContainer = document.querySelector('.messages-container') as HTMLDivElement;
      if (messagesContainer) {
        const inputHeight = Math.min(scrollHeight, 120);
        messagesContainer.style.paddingBottom = `${inputHeight + 32}px`; // 32px for padding
      }
    }
  }, [input]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent">
      <div className="max-w-2xl mx-auto p-4">
        <VoiceRecorder
          sessionId={sessionId}
          onTranscription={handleTranscription}
          disabled={isLoading}
        >
          {(isRecording, isProcessing) => (
            <div className="flex gap-2 items-end">
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
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[44px] max-h-[120px] resize-none overflow-y-auto"
                  rows={1}
                />
              )}
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-teal hover:bg-teal/90 shrink-0"
              >
                Send
              </Button>
            </div>
          )}
        </VoiceRecorder>
      </div>
    </div>
  );
};