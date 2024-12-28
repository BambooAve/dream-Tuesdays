import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/supabase";

export const logConversation = async (sessionId: string, messages: Message[]) => {
  try {
    await supabase
      .from("vivid_vision_conversation_logs")
      .insert({
        session_id: sessionId,
        conversation_data: messages,
      });
  } catch (error) {
    console.error("Error logging conversation:", error);
  }
};