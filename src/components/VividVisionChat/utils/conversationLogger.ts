import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/supabase";

export const logConversation = async (sessionId: string, messages: Message[]) => {
  try {
    // Convert Message[] to a plain object array that matches Json type
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      role: message.role,
      created_at: message.created_at,
      session_id: message.session_id
    }));

    await supabase
      .from("vivid_vision_conversation_logs")
      .insert({
        session_id: sessionId,
        conversation_data: formattedMessages
      });
  } catch (error) {
    console.error("Error logging conversation:", error);
  }
};