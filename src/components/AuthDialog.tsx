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
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const isMobile = useIsMobile();

  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { identifier, password } = values;
      
      if (isSignUp) {
        try {
          const { user } = await createUserWithMetadata(identifier, password, authMethod === "email");
          
          if (user) {
            // Redirect to profile completion if profile is not complete
            const isProfileComplete = await checkProfileCompletion(user.id);
            if (!isProfileComplete) {
              navigate("/complete-profile");
            }
          }

          toast({
            title: "Account created!",
            description: "Please check your email for verification.",
          });
          onClose();
        } catch (error: any) {
          // Check if it's a user already exists error
          if (error.message?.includes("User already registered") || 
              error.message?.includes("user already exists")) {
            toast({
              variant: "destructive",
              title: "Account already exists",
              description: "Please sign in instead.",
            });
            setIsSignUp(false); // Switch to sign in mode
            return;
          }
          throw error;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword(
          authMethod === "email" 
            ? { email: identifier, password }
            : { phone: identifier, password }
        );
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Invalid credentials",
              description: "Please check your email and password.",
            });
            return;
          }
          throw error;
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

            <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as "email" | "phone")} className="mt-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger 
                  value="email"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                >
                  Email
                </TabsTrigger>
                <TabsTrigger 
                  value="phone"
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
                >
                  Phone
                </TabsTrigger>
              </TabsList>

              <AuthForm
                isSignUp={isSignUp}
                authMethod={authMethod}
                isLoading={isLoading}
                onSubmit={onSubmit}
              />
            </Tabs>

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