import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FullscreenMenu } from "./FullscreenMenu";
import { AuthDialog } from "./AuthDialog";
import { UserRound } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // If user just signed in, check if they have any vivid vision sessions
      if (currentUser) {
        const { data: existingSessions } = await supabase
          .from("vivid_vision_sessions")
          .select("id")
          .eq("user_id", currentUser.id)
          .single();

        // If no sessions exist, this is a new user - redirect to vivid vision
        if (!existingSessions) {
          navigate("/vivid-vision");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            onClick={() => setIsMenuOpen(true)}
          />
          {user ? (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10 rounded-full"
            >
              <UserRound className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-white hover:bg-white/10"
              onClick={() => setIsAuthOpen(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>
      <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};