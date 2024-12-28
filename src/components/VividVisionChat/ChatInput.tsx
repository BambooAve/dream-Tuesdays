import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ input, setInput, handleSendMessage, isLoading }: ChatInputProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const audioRecorderRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
      }
    };
  }, [ws]);

  const setupWebSocket = () => {
    const wsUrl = `wss://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.functions.supabase.co/functions/v1/realtime-chat`;
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      console.log('WebSocket connected');
      startRecording();
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcript') {
        setInput(prev => prev + ' ' + data.text);
      }
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Error",
        description: "Failed to connect to voice service",
        variant: "destructive",
      });
      setIsRecording(false);
    };

    setWs(newWs);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (ws?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const audioData = encodeAudioForAPI(new Float32Array(inputData));
          ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: audioData
          }));
        }
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      audioRecorderRef.current = {
        stream,
        audioContext,
        source,
        processor,
        stop: () => {
          source.disconnect();
          processor.disconnect();
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
        }
      };
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      setIsRecording(false);
      if (ws) {
        ws.close();
      }
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
      }
    } else {
      setIsRecording(true);
      setupWebSocket();
    }
  };

  const encodeAudioForAPI = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, chunk);
    }
    
    return btoa(binary);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
      <div className="max-w-2xl mx-auto flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`text-white hover:bg-white/10 ${isRecording ? 'bg-red-500/20' : ''}`}
          onClick={handleVoiceInput}
        >
          {isRecording ? (
            <MicOff className="h-5 w-5 text-red-500" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
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