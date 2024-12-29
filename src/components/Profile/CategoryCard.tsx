import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GoalCard } from "./GoalCard";
import { EmptyState } from "./EmptyState";
import { Category, Goal } from "./types";
import { 
  Heart, 
  Briefcase, 
  DollarSign, 
  BookOpen, 
  Users, 
  Plane, 
  Leaf, 
  Palette, 
  Group, 
  Sun,
  LucideIcon,
  ArrowRight
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
  goals: Goal[];
  isFirst?: boolean;
  hasCompletedChat: boolean;
}

const getCategoryIcon = (type: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    HEALTH_AND_WELLNESS: Heart,
    CAREER_AND_PROFESSIONAL_GROWTH: Briefcase,
    FINANCIAL_GOALS: DollarSign,
    PERSONAL_DEVELOPMENT: BookOpen,
    RELATIONSHIPS_AND_SOCIAL_LIFE: Users,
    TRAVEL_AND_ADVENTURE: Plane,
    HABITS_AND_LIFESTYLE_CHANGES: Leaf,
    CREATIVITY_AND_EXPRESSION: Palette,
    COMMUNITY_AND_CONTRIBUTION: Group,
    SPIRITUALITY_AND_PURPOSE: Sun,
  };
  return icons[type] || BookOpen;
};

const getCategoryDescription = (type: string): string => {
  const descriptions: Record<string, string> = {
    HEALTH_AND_WELLNESS: "Set goals for fitness, nutrition, and mental health.",
    CAREER_AND_PROFESSIONAL_GROWTH: "Advance your career and professional skills.",
    FINANCIAL_GOALS: "Build wealth and achieve financial freedom.",
    PERSONAL_DEVELOPMENT: "Grow personally and develop new skills.",
    RELATIONSHIPS_AND_SOCIAL_LIFE: "Strengthen relationships and social connections.",
    TRAVEL_AND_ADVENTURE: "Explore new places and create memories.",
    HABITS_AND_LIFESTYLE_CHANGES: "Build positive habits and lifestyle changes.",
    CREATIVITY_AND_EXPRESSION: "Express yourself through creative pursuits.",
    COMMUNITY_AND_CONTRIBUTION: "Make a positive impact in your community.",
    SPIRITUALITY_AND_PURPOSE: "Discover purpose and spiritual growth.",
  };
  return descriptions[type] || "Set and achieve your goals in this category.";
};

export const CategoryCard = ({ 
  category, 
  goals, 
  isFirst,
  hasCompletedChat 
}: CategoryCardProps) => {
  const Icon = getCategoryIcon(category.type);

  return (
    <Card 
      className={`group bg-white/10 border-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/15 ${
        isFirst ? 'col-span-full' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-white/80" />
          <h2 className="text-xl font-semibold">{category.name}</h2>
        </div>
      </CardHeader>
      <CardContent>
        {hasCompletedChat ? (
          goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-white/60">
              No goals set yet for this category
            </div>
          )
        ) : (
          <div className="space-y-4">
            <p className="text-white/80">{getCategoryDescription(category.type)}</p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-teal flex items-center gap-1">
              Add Goals with Jaxon <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};