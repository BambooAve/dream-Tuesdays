import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { motivationOptions } from "./constants";

export const ProfileForm = () => {
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

      navigate("/profile");
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">First Name</label>
          <Input
            required
            value={profile.first_name}
            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white/90">Last Name</label>
          <Input
            required
            value={profile.last_name}
            onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white/90">Age</label>
        <Input
          type="number"
          required
          value={profile.age}
          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          className="bg-white/10 border-white/20 text-white placeholder-white/50 w-full"
          min="13"
          max="120"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white/90">Gender</label>
        <Select
          value={profile.gender}
          onValueChange={(value) => setProfile({ ...profile, gender: value })}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
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
        <label className="block text-sm font-medium mb-2 text-white/90">City</label>
        <Input
          required
          value={profile.city}
          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          className="bg-white/10 border-white/20 text-white placeholder-white/50 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white/90">
          What's the biggest change you're hoping to create in your life with this app?
        </label>
        <Select
          value={profile.motivation}
          onValueChange={(value) => setProfile({ ...profile, motivation: value })}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
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
  );
};