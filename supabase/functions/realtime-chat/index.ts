import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  
  // Create WebSocket connection to OpenAI
  const openAIWs = new WebSocket('wss://api.openai.com/v1/audio-streaming/speech')
  
  socket.onopen = () => {
    console.log("Client connected")
  }

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data)
      openAIWs.send(JSON.stringify(data))
    } catch (error) {
      console.error('Error processing message:', error)
    }
  }

  socket.onerror = (e) => {
    console.error("WebSocket error:", e)
  }

  socket.onclose = () => {
    console.log("Client disconnected")
    openAIWs.close()
  }

  openAIWs.onmessage = (event) => {
    socket.send(event.data)
  }

  return response
})