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
      textareaRef.current.style.height = '44px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
      
      const messagesContainer = document.querySelector('.messages-container') as HTMLDivElement;
      if (messagesContainer) {
        const inputHeight = Math.min(scrollHeight, 120);
        messagesContainer.style.paddingBottom = `${inputHeight + 32}px`;
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent">
      <div className="max-w-4xl mx-auto p-4">
        <VoiceRecorder
          sessionId={sessionId}
          onTranscription={handleTranscription}
          disabled={isLoading}
        >
          {(isRecording, isProcessing) => (
            <div className="flex gap-2 items-end">
              <Button
                variant="ghost"
                size="icon"
                className={`shrink-0 text-white hover:bg-white/10 rounded-full w-11 h-11 ${
                  isRecording ? 'bg-red-500/20 animate-pulse' : ''
                }`}
                disabled={isLoading || isProcessing}
              >
                {isRecording ? (
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
                ) : isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <AudioWaveform className="h-5 w-5" />
                )}
              </Button>
              {isRecording ? (
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2">
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
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-teal" />
                  <span className="text-white/60 text-sm">Processing audio...</span>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-2xl shadow-lg">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="border-0 focus-visible:ring-0 resize-none overflow-y-auto min-h-[44px] max-h-[120px] rounded-2xl text-black w-full"
                    rows={1}
                  />
                </div>
              )}
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-brand-orange hover:bg-brand-orange/90 shrink-0 rounded-xl shadow-lg"
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