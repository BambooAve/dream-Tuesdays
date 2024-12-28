import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GoalCard } from "./GoalCard";
import { EmptyState } from "./EmptyState";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface CategoryCardProps {
  category: Category;
  goals: Goal[];
  isFirst?: boolean;
}

export const CategoryCard = ({ category, goals, isFirst }: CategoryCardProps) => {
  return (
    <Card className={`bg-white/10 border-white/20 backdrop-blur-sm text-white ${isFirst ? 'col-span-full' : ''}`}>
      <CardHeader>
        <h2 className="text-xl font-semibold">{category.name}</h2>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          isFirst && <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};