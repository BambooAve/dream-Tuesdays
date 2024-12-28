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
    <div className="min-h-screen w-full bg-gradient-to-tl from-[#AA5E3B] via-[#AA5E3B] to-gray-100/20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8 text-white">Complete Your Profile</h1>
            <p className="text-white/80 mb-12 text-lg">
              Help us personalize your experience by sharing a bit about yourself.
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <ProfileForm />
          </div>
        </div>
        <div className="mt-20 flex justify-center">
          <GrowthAnimation />
        </div>
      </div>
    </div>
  );
};