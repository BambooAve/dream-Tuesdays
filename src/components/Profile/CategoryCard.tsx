import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GoalCard } from "./GoalCard";

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
}

export const CategoryCard = ({ category, goals }: CategoryCardProps) => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
      <CardHeader>
        <h2 className="text-xl font-semibold">{category.name}</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};