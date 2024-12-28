import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
}

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{goal.title}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {goal.description && (
        <p className="text-sm text-white/70 mt-1">
          {goal.description}
        </p>
      )}
      {goal.target_date && (
        <div className="flex items-center gap-1 text-sm text-white/60 mt-2">
          <Calendar className="h-3 w-3" />
          {new Date(goal.target_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};