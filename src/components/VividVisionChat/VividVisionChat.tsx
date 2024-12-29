import { useVividVisionSession } from "./hooks/useVividVisionSession";
import { useMessageHandling } from "./hooks/useMessageHandling";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ProgressBar } from "./ProgressBar";
import { ChatCompletion } from "./ChatCompletion";
import { WelcomeScreen } from "./WelcomeScreen";
import { supabase } from "@/integrations/supabase/client";
import { Message, Session } from "@/types/supabase";

export const VividVisionChat = () => {
  const {
    messages,
    setMessages,
    session,
    setSession,
    hasStarted,
    setHasStarted,
    updateSessionProgress,
    completeSession,
  } = useVividVisionSession();

  const {
    input,
    setInput,
    isLoading,
    typingMessage,
    setTypingMessage,
    handleSendMessage,
    handleTypingComplete,
  } = useMessageHandling(
    session,
    messages,
    setMessages,
    updateSessionProgress,
    completeSession
  );

  const handleStartChat = async (introMessage: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!session) {
      const { data: newSession } = await supabase
        .from("vivid_vision_sessions")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (newSession) {
        setSession(newSession as Session);
        
        const { data: userMessage } = await supabase
          .from("vivid_vision_messages")
          .insert({
            session_id: newSession.id,
            content: introMessage,
            role: "user" as const,
          })
          .select()
          .single();

        if (userMessage) {
          setMessages([userMessage as Message]);
          setHasStarted(true);
          
          setTimeout(() => {
            const response = "Thank you for sharing! I'm excited to help you create your vivid vision. " +
                           "Let's start crafting your future vision. What area of your life would you like to focus on first?";
            setTypingMessage(response);
          }, 1000);
        }
      }
    }
  };

  // Check if the chat is complete
  const isChatComplete = messages.length > 0 && 
    messages[messages.length - 1].role === 'assistant' && 
    messages[messages.length - 1].content.includes("I'm now working on creating your final Vivid Vision goals");

  if (!hasStarted) {
    return <WelcomeScreen onStart={handleStartChat} />;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      {session && <ProgressBar progress={session.progress} />}
      <ChatMessages 
        messages={messages} 
        typingMessage={typingMessage}
        onTypingComplete={handleTypingComplete}
      />
      {isChatComplete ? (
        <ChatCompletion sessionId={session?.id || ''} messages={messages} />
      ) : (
        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading || !!typingMessage}
          sessionId={session?.id || ''}
        />
      )}
    </div>
  );
};