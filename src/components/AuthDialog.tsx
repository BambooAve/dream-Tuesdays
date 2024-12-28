import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState<"email" | "phone">("email");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Phone number must be in E.164 format (e.g., +12345678900)");
    }
    return phone;
  };

  const handleAuthError = (error: any) => {
    let title = "Error";
    let description = error.message;

    // Handle specific error cases
    if (error.message.includes("Invalid login credentials")) {
      if (mode === "sign-in") {
        title = "Account Not Found";
        description = "We couldn't find an account with these credentials. Please check your password or sign up if you don't have an account yet.";
      } else {
        title = "Sign Up Failed";
        description = "There was an error creating your account. Please try again.";
      }
    } else if (error.message.includes("Email not confirmed")) {
      title = "Email Not Verified";
      description = "Please check your email for the verification link.";
    } else if (error.message.includes("Phone not confirmed")) {
      title = "Phone Not Verified";
      description = "Please verify your phone number before signing in.";
    } else if (error.message.includes("User already registered")) {
      title = "Account Exists";
      description = "An account with these credentials already exists. Please sign in instead.";
      // Switch to sign-in mode
      setMode("sign-in");
    }

    toast({
      variant: "destructive",
      title,
      description,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authType === "phone") {
        try {
          validatePhoneNumber(formData.phone);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Invalid Phone Number",
            description: error.message,
          });
          setIsLoading(false);
          return;
        }
      }

      if (mode === "sign-up") {
        const { error } = authType === "email" 
          ? await supabase.auth.signUp({
              email: formData.email,
              password: formData.password,
            })
          : await supabase.auth.signUp({
              phone: formData.phone,
              password: formData.password,
            });

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: authType === "email" 
            ? "Please check your email for verification."
            : "Please check your phone for the verification code.",
        });
        
        // Switch to sign-in mode after successful signup
        setMode("sign-in");
      } else {
        const { error } = authType === "email"
          ? await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            })
          : await supabase.auth.signInWithPassword({
              phone: formData.phone,
              password: formData.password,
            });

        if (error) throw error;
        onClose();
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {mode === "sign-in" ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={authType} onValueChange={(value) => setAuthType(value as "email" | "phone")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="email">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required={authType === "email"}
              />
            </TabsContent>
            <TabsContent value="phone">
              <Input
                type="tel"
                placeholder="Phone (e.g., +12345678900)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required={authType === "phone"}
                pattern="^\+[1-9]\d{1,14}$"
                title="Phone number must be in E.164 format (e.g., +12345678900)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Format: +[country code][number] (e.g., +12345678900)
              </p>
            </TabsContent>
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : mode === "sign-in" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </Tabs>
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            className="text-blue-600 hover:underline"
          >
            {mode === "sign-in" 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};