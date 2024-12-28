import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FullscreenMenu } from "./FullscreenMenu";
import { AuthDialog } from "./AuthDialog";
import { UserRound, LogOut } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      if (currentUser) {
        // Check if user has completed their profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", currentUser.id)
          .single();

        if (!profile?.first_name) {
          // If profile is not complete, redirect to profile completion
          navigate("/complete-profile");
        } else {
          // Check for vivid vision sessions
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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      navigate("/");
    }
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            onClick={() => setIsMenuOpen(true)}
          />
          {user ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
              >
                <UserRound className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-white hover:bg-white/10 rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
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