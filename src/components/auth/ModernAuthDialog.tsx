import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BenefitShape } from "./BenefitShape";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ModernAuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  {
    title: "Clarity on Your Goals",
    description: "Through our guided tools, you'll uncover what truly matters to you and create actionable goals.",
    shape: "sphere" as const,
  },
  {
    title: "Transform Your Vision",
    description: "Turn your dreams into reality with our powerful vision-building framework.",
    shape: "cube" as const,
  },
  {
    title: "Track Your Progress",
    description: "Stay motivated with visual progress tracking and milestone celebrations.",
    shape: "pyramid" as const,
  },
];

export function ModernAuthDialog({ isOpen, onOpenChange }: ModernAuthDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We sent you a confirmation link to complete your registration.",
      });
      
      navigate("/complete-profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-4xl">
        <div className="flex flex-col md:flex-row w-full min-h-[600px]">
          {/* Left Panel - Sign Up Form */}
          <div className="flex-1 p-8 bg-gradient-to-br from-[#FF7F50] to-[#FF4500] text-white">
            <div className="h-full flex flex-col justify-center max-w-md mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Get Started with Dream Tuesdays</h2>
                <p className="text-white/80">Sign up today to transform your daily life.</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/10 text-white border-white/20 placeholder:text-white/50 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-[#FF4500] hover:bg-white/90 transition-all"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Panel - Benefits */}
          <div className="flex-1 bg-white p-8 overflow-y-auto">
            <div className="h-full flex flex-col justify-center max-w-md mx-auto space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">Why Choose Us?</h3>
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <BenefitShape type={benefit.shape} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}