import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/Profile/types";

interface WelcomeScreenProps {
  onStart: (introMessage: string) => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const handleStart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      if (profile) {
        const introMessage = createIntroMessage(profile);
        onStart(introMessage);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const createIntroMessage = (profile: Profile) => {
    const pronouns = profile.gender === 'male' ? 'he/him' : 
                    profile.gender === 'female' ? 'she/her' : 
                    profile.gender === 'non_binary' ? 'they/them' : 
                    'they/them';

    return `Hi, I'm ${profile.first_name}! I'm ${profile.age} years old and I'm from ${profile.city}. ` +
           `I use ${pronouns} pronouns. I'm here because ${profile.motivation}. ` +
           `I'm excited to create my vivid vision for the future!`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
        <h1 className="text-4xl font-bold leading-tight">
          Imagine writing down exactly what your dream life looks like 365 days from now—and then actually living it.
        </h1>
        <p className="text-xl text-gray-300">
          That's what we're going to do today.
        </p>
        <div className="space-y-4">
          <p className="text-gray-400">
            This is your time to reflect, dream, and plan. The first step toward transformation is setting your intentions.
          </p>
          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-full"
          >
            Start Now
          </Button>
        </div>
      </div>
    </div>
  );
};