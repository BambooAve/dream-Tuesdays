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
  hasCompletedChat: boolean;
}

export const ProfileHeader = ({ profile, hasCompletedChat }: ProfileHeaderProps) => {
  return (
    <Card className="bg-white/95 border-white/20 backdrop-blur-sm">
      <CardHeader className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <Avatar className="h-20 w-20">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={`${profile.first_name}'s avatar`} />
            ) : (
              <AvatarFallback className="bg-brand-secondary text-white">
                <UserRound className="h-10 w-10" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-black">
              {profile?.first_name || 'Welcome'} {profile?.last_name || ''}
            </h1>
            <p className="text-black/80">{profile?.city || 'Complete your profile'}</p>
          </div>
        </div>
        <div className="text-xl text-black/90">
          {hasCompletedChat ? (
            `Welcome back, ${profile?.first_name || 'there'}! Let's keep building your Dream Tuesday.`
          ) : (
            `Your Dream Tuesday starts here! Chat with Jaxon to create your personalized plan.`
          )}
        </div>
      </CardHeader>
    </Card>
  );
};