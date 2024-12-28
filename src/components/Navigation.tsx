import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FullscreenMenu } from "./FullscreenMenu";
import { AuthDialog } from "./AuthDialog";
import { UserRound } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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