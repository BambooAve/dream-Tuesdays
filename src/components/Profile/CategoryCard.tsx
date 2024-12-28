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
  LucideIcon
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
  goals: Goal[];
  isFirst?: boolean;
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

export const CategoryCard = ({ category, goals, isFirst }: CategoryCardProps) => {
  const Icon = getCategoryIcon(category.type);

  return (
    <Card className={`bg-white/10 border-white/20 backdrop-blur-sm text-white ${isFirst ? 'col-span-full' : ''}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-white/80" />
          <h2 className="text-xl font-semibold">{category.name}</h2>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : isFirst ? (
          <EmptyState />
        ) : (
          <div className="text-center py-6 text-white/60">
            No goals set yet for this category
          </div>
        )}
      </CardContent>
    </Card>
  );
};