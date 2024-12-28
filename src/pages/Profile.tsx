import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { UserRound } from "lucide-react";

interface Profile {
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  city: string;
  motivation: string;
  avatar_url: string | null;
}

export const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20 flex items-center justify-center">
        <div className="text-white">No profile found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={`${profile.first_name}'s avatar`} />
                ) : (
                  <AvatarFallback className="bg-brand-black text-white">
                    <UserRound className="h-10 w-10" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-white/80">{profile.city}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
                  <div className="space-y-2">
                    <p>
                      <span className="text-white/60">Age:</span> {profile.age}
                    </p>
                    <p>
                      <span className="text-white/60">Gender:</span>{" "}
                      {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Motivation</h2>
                  <p className="text-white/80">{profile.motivation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};