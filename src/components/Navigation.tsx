import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FullscreenMenu } from "./FullscreenMenu";
import { AuthDialog } from "./AuthDialog";
import { UserRound, LogOut, LogIn, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MenuOctahedron } from "./MenuOctahedron";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          // Only proceed with checks if we have a logged-in user
          if (currentUser) {
            // Check if user has completed their profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("first_name")
              .eq("id", currentUser.id)
              .maybeSingle();

            // Only redirect to profile completion if:
            // 1. Profile is not complete (no first_name)
            // 2. We're not already on the complete-profile page
            // 3. We're not in the middle of logging out
            if (!profile?.first_name && 
                location.pathname !== '/complete-profile' && 
                !isLoggingOut) {
              navigate("/complete-profile");
              return;
            }

            // Only check for vivid vision sessions if:
            // 1. Profile is complete
            // 2. We're not already on the vivid-vision page
            // 3. We're not in the middle of logging out
            if (profile?.first_name && 
                location.pathname !== '/vivid-vision' && 
                !isLoggingOut) {
              const { data: existingSessions } = await supabase
                .from("vivid_vision_sessions")
                .select("id")
                .eq("user_id", currentUser.id)
                .maybeSingle();

              if (!existingSessions) {
                navigate("/vivid-vision");
              }
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, [navigate, location.pathname, isLoggingOut]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      
      setUser(null);
      navigate("/");
      
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button 
              className="rounded-full bg-transparent flex items-center justify-center hover:opacity-80 transition-opacity"
              onClick={() => setIsMenuOpen(true)}
            >
              <MenuOctahedron />
            </button>
            <span className="text-white font-medium">MENU</span>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <UserRound className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-white hover:bg-white/10 rounded-full"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 flex items-center gap-2"
              onClick={() => setIsAuthOpen(true)}
            >
              <LogIn className="h-5 w-5" />
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