import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { UserRound } from "lucide-react";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  avatar_url: string | null;
}

interface ProfileHeaderProps {
  profile: Profile | null;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
      <CardHeader className="space-y-6">
        <div className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={`${profile.first_name}'s avatar`} />
            ) : (
              <AvatarFallback className="bg-brand-black text-white">
                <UserRound className="h-10 w-10" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {profile?.first_name || 'Welcome'} {profile?.last_name || ''}
            </h1>
            <p className="text-white/80">{profile?.city || 'Complete your profile'}</p>
          </div>
        </div>
        <div className="text-xl text-white/90">
          Hi {profile?.first_name || 'there'}! Let's build the life you envision. Here's your current progress.
        </div>
      </CardHeader>
    </Card>
  );
};