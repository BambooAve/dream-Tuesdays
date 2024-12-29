import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./Auth/AuthForm";
import { SignUpContent } from "./Auth/SignUpContent";
import { createUserWithMetadata, checkProfileCompletion } from "@/utils/auth";
import { z } from "zod";
import { useIsMobile } from "@/hooks/use-mobile";

const authSchema = z.object({
  identifier: z.string().min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const AuthDialog = ({
  isOpen,
  onClose,
  defaultToSignUp = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultToSignUp?: boolean;
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(defaultToSignUp);
  const isMobile = useIsMobile();

  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { identifier, password } = values;
      
      if (isSignUp) {
        try {
          const { user } = await createUserWithMetadata(identifier, password);
          
          if (user) {
            // Redirect to profile completion if profile is not complete
            const isProfileComplete = await checkProfileCompletion(user.id);
            if (!isProfileComplete) {
              navigate("/complete-profile");
            }
          }

          toast({
            title: "Account created!",
            description: "You can now sign in with your username.",
          });
          onClose();
        } catch (error: any) {
          console.error("Signup error:", error);
          toast({
            variant: "destructive",
            title: "Error creating account",
            description: error.message || "Please try again with a different username",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: `${identifier}@temporary.com`,
          password
        });
        
        if (error) {
          console.error("Login error:", error);
          toast({
            variant: "destructive",
            title: "Invalid credentials",
            description: "Please check your username and password.",
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        onClose();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during authentication",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[872px] p-0 gap-0 ${isMobile ? 'h-[90vh]' : ''}`}>
        <div className={`grid sm:grid-cols-2 ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
          <div className="p-6 bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-white">
                {isSignUp ? "Create your account" : "Welcome back"}
              </DialogTitle>
            </DialogHeader>

            <AuthForm
              isSignUp={isSignUp}
              isLoading={isLoading}
              onSubmit={onSubmit}
              authMethod="username"
            />

            <Button
              type="button"
              variant="ghost"
              className="w-full mt-4 text-white hover:text-white/90 hover:bg-white/10"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </div>

          {isSignUp && (
            <div className="border-l">
              <SignUpContent />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};