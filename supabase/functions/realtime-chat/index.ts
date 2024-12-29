import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  console.log("WebSocket connection established");

  socket.onopen = () => {
    console.log("Client connected");
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received message type:", data.type);

      if (data.type === 'input_audio_buffer.append') {
        const audioData = data.audio;
        
        // Convert base64 to binary
        const binaryString = atob(audioData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Create form data with audio file
        const formData = new FormData();
        formData.append('file', new Blob([bytes], { type: 'audio/wav' }), 'audio.wav');
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');

        // Send to OpenAI Whisper API
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Transcription result:", result);

        // Send transcription back to client
        socket.send(JSON.stringify({
          type: 'transcript',
          text: result.text
        }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  };

  socket.onerror = (e) => {
    console.error("WebSocket error:", e);
  };

  socket.onclose = () => {
    console.log("Client disconnected");
  };

  return response;
});