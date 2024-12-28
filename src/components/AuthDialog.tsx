import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
          description: "Please check your email for confirmation instructions.",
        });
        
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

        if (error) {
          if (error.message === "Email not confirmed") {
            toast({
              variant: "destructive",
              title: "Email Not Confirmed",
              description: "Please check your email and click the confirmation link before signing in.",
            });
          } else {
            throw error;
          }
          return;
        }
        onClose();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
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