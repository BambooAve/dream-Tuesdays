import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const motivationOptions = [
  {
    value: "personal_growth",
    label: "Achieve personal growth",
    description: "I want to focus on building better habits and becoming the best version of myself.",
  },
  {
    value: "health_wellness",
    label: "Improve health and wellness",
    description: "I'm looking to get healthier, both physically and mentally.",
  },
  {
    value: "relationships",
    label: "Strengthen relationships",
    description: "I want to improve my connections with family, friends, or my partner.",
  },
  {
    value: "career_goals",
    label: "Plan and achieve career goals",
    description: "I want to grow in my career or work toward professional goals.",
  },
  {
    value: "finances",
    label: "Manage finances better",
    description: "I'm looking to save more, spend smarter, or become financially stable.",
  },
  {
    value: "hobbies_creativity",
    label: "Explore hobbies and creativity",
    description: "I want to try new hobbies or pursue creative passions.",
  },
  {
    value: "balanced_life",
    label: "Live a more balanced life",
    description: "I'm seeking better balance between work, personal time, and relaxation.",
  },
  {
    value: "life_change",
    label: "Prepare for a big life change",
    description: "I'm transitioning into a new phase of life (e.g., new job, moving, starting school).",
  },
  {
    value: "purpose",
    label: "Discover a sense of purpose",
    description: "I want to figure out what truly motivates and fulfills me.",
  },
  {
    value: "all",
    label: "All of the above",
    description: "I want a bit of everything—health, growth, relationships, and balance.",
  },
];

export const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    city: "",
    motivation: "",
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          age: parseInt(profile.age),
          gender: profile.gender,
          city: profile.city,
          motivation: profile.motivation,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      navigate("/vivid-vision");
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Profile</h1>
        <p className="text-gray-300 mb-8 text-center">
          Help us personalize your experience by sharing a bit about yourself.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input
                required
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input
                required
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <Input
              type="number"
              required
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              min="13"
              max="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <Select
              value={profile.gender}
              onValueChange={(value) => setProfile({ ...profile, gender: value })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non_binary">Non-binary</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <Input
              required
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What's the biggest change you're hoping to create in your life with this app?
            </label>
            <Select
              value={profile.motivation}
              onValueChange={(value) => setProfile({ ...profile, motivation: value })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select your motivation" />
              </SelectTrigger>
              <SelectContent>
                {motivationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="py-2">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};