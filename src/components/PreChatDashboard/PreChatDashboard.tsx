import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, PencilIcon, ArrowRight, Heart, HandshakeIcon, Briefcase, PiggyBank, GraduationCap, PartyPopper, Plus } from "lucide-react";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { CategoryTile } from "./CategoryTile";

interface PreChatDashboardProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    city: string | null;
    avatar_url: string | null;
  } | null;
  onStartChat: () => void;
  onEditProfile: () => void;
}

const DEFAULT_CATEGORIES = [
  {
    id: "health",
    name: "Health",
    description: "Set goals for your health journey",
    icon: Heart,
  },
  {
    id: "relationships",
    name: "Relationships",
    description: "Build meaningful connections",
    icon: HandshakeIcon,
  },
  {
    id: "career",
    name: "Career",
    description: "Advance your professional growth",
    icon: Briefcase,
  },
  {
    id: "finance",
    name: "Finance",
    description: "Achieve financial freedom",
    icon: PiggyBank,
  },
  {
    id: "personal-development",
    name: "Personal Development",
    description: "Invest in your growth",
    icon: GraduationCap,
  },
  {
    id: "fun-recreation",
    name: "Fun & Recreation",
    description: "Make time for joy",
    icon: PartyPopper,
  },
];

export const PreChatDashboard = ({ profile, onStartChat, onEditProfile }: PreChatDashboardProps) => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<Array<{ id: string; name: string; description: string }>>([]);

  const handleAddCategory = (category: { name: string; description: string }) => {
    setCustomCategories([
      ...customCategories,
      {
        id: `custom-${Date.now()}`,
        ...category,
      },
    ]);
    setIsAddCategoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6e6e6] to-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center space-y-6 mb-12">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 border-2 border-brand-primary">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={`${profile.first_name}'s avatar`} />
              ) : (
                <AvatarFallback className="bg-brand-secondary text-white">
                  <UserRound className="h-12 w-12" />
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-white shadow-md hover:bg-gray-50"
              onClick={onEditProfile}
            >
              <PencilIcon className="h-4 w-4 text-brand-secondary" />
            </Button>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-brand-secondary">
              {profile?.first_name || 'Welcome'} {profile?.last_name || ''}
            </h1>
            <p className="text-[#053333] mt-2">{profile?.city || 'Add your location'}</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {DEFAULT_CATEGORIES.map((category) => (
            <CategoryTile
              key={category.id}
              name={category.name}
              description={category.description}
              Icon={category.icon}
            />
          ))}
          {customCategories.map((category) => (
            <CategoryTile
              key={category.id}
              name={category.name}
              description={category.description}
              Icon={Plus}
            />
          ))}
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="group p-6 rounded-xl bg-white border-2 border-dashed border-gray-200 hover:border-brand-primary transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-brand-primary/10">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-brand-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-700 group-hover:text-brand-primary">Add Category</h3>
                <p className="text-sm text-gray-500">Create a custom category</p>
              </div>
            </div>
          </button>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <p className="text-2xl text-brand-secondary">
            Let's start building your Dream Tuesday. Chat with Jaxon to populate your goals.
          </p>
          <Button
            onClick={onStartChat}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-6 text-lg rounded-full"
          >
            Start the Chat with Jaxon
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};