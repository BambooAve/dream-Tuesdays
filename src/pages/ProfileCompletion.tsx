import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/ProfileCompletion/ProfileForm";
import { GrowthAnimation } from "@/components/ProfileCompletion/GrowthAnimation";

export const ProfileCompletion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-[#AA5E3B] via-[#AA5E3B] to-gray-100/20 relative">
      <div className="container mx-auto px-8 py-20">
        <div className="flex justify-between items-center">
          <div className="w-1/2">
            <GrowthAnimation />
          </div>
          <div className="w-1/2 max-w-2xl">
            <h1 className="text-4xl font-bold mb-8 text-white">Complete Your Profile</h1>
            <p className="text-white/80 mb-12 text-lg">
              Help us personalize your experience by sharing a bit about yourself.
            </p>
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
};