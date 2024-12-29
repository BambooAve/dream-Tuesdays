import { Button } from "@/components/ui/button";
import { CategoryCard } from "./CategoryCard";
import { Category, Goal } from "./types";
import { ArrowRight } from "lucide-react";

interface CategoriesGridProps {
  categories: Category[];
  goals: Goal[];
  hasCompletedChat: boolean;
  onStartChat: () => void;
}

export const CategoriesGrid = ({ 
  categories, 
  goals, 
  hasCompletedChat,
  onStartChat 
}: CategoriesGridProps) => {
  const getCategoryGoals = (categoryId: string) => {
    return goals.filter((goal) => goal.category_id === categoryId);
  };

  const categoriesWithGoals = hasCompletedChat 
    ? categories.filter(cat => getCategoryGoals(cat.id).length > 0)
    : categories;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesWithGoals.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            goals={getCategoryGoals(category.id)}
            isFirst={index === 0}
            hasCompletedChat={hasCompletedChat}
          />
        ))}
      </div>
      
      {!hasCompletedChat && (
        <div className="mt-8 text-center">
          <Button
            onClick={onStartChat}
            className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-6 text-lg rounded-full"
          >
            Start Your Journey with Jaxon
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-white/80">
            Transform your life one Dream Tuesday at a time.
          </p>
        </div>
      )}
    </>
  );
};