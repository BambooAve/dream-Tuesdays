import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "./types";

interface AddGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  newGoal: {
    title: string;
    description: string;
    category_id: string;
    target_date: string;
    priority: string;
  };
  setNewGoal: (goal: any) => void;
  handleAddGoal: () => void;
}

export const AddGoalDialog = ({
  isOpen,
  onOpenChange,
  categories,
  newGoal,
  setNewGoal,
  handleAddGoal,
}: AddGoalDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={newGoal.category_id}
              onValueChange={(value) =>
                setNewGoal({ ...newGoal, category_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="target_date">Target Date</Label>
            <Input
              id="target_date"
              type="date"
              value={newGoal.target_date}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target_date: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority (1-5)</Label>
            <Select
              value={newGoal.priority}
              onValueChange={(value) =>
                setNewGoal({ ...newGoal, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((priority) => (
                  <SelectItem key={priority} value={priority.toString()}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddGoal} className="w-full">
            Add Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};