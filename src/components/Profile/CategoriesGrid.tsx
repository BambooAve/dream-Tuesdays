import { CategoryCard } from "./CategoryCard";
import { Category, Goal } from "./types";

interface CategoriesGridProps {
  categories: Category[];
  goals: Goal[];
}

export const CategoriesGrid = ({ categories, goals }: CategoriesGridProps) => {
  const getCategoryGoals = (categoryId: string) => {
    return goals.filter((goal) => goal.category_id === categoryId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          goals={getCategoryGoals(category.id)}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};