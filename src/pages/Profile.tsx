import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { UserRound, Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

interface Profile {
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  gender: string | null;
  city: string | null;
  motivation: string | null;
  avatar_url: string | null;
}

interface Category {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
}

interface Goal {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  priority: number | null;
  status: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category_id: "",
    target_date: "",
    priority: "3",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/");
          return;
        }

        // Use maybeSingle() instead of single() to handle the case when no profile is found
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        
        // If no profile exists, create one
        if (!profileData) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([{ id: session.user.id }])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          setProfile(profileData);
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", session.user.id);

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);

        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from("goals")
          .select("*")
          .eq("user_id", session.user.id);

        if (goalsError) throw goalsError;
        setGoals(goalsData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleAddGoal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("goals")
        .insert([
          {
            user_id: session.user.id,
            ...newGoal,
            priority: parseInt(newGoal.priority),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setGoals([...goals, data]);
      setIsAddGoalOpen(false);
      setNewGoal({
        title: "",
        description: "",
        category_id: "",
        target_date: "",
        priority: "3",
      });

      toast({
        title: "Success",
        description: "Goal added successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add goal",
      });
    }
  };

  const getCategoryGoals = (categoryId: string) => {
    return goals.filter((goal) => goal.category_id === categoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={`${profile.first_name}'s avatar`} />
                ) : (
                  <AvatarFallback className="bg-brand-black text-white">
                    <UserRound className="h-10 w-10" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  {profile?.first_name || 'Welcome'} {profile?.last_name || ''}
                </h1>
                <p className="text-white/80">{profile?.city || 'Complete your profile'}</p>
              </div>
            </CardHeader>
          </Card>

          {/* Goals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
                <CardHeader>
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getCategoryGoals(category.id).map((goal) => (
                      <div
                        key={goal.id}
                        className="p-3 rounded-lg bg-white/5 border border-white/10"
                      >
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Goal Dialog */}
          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
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
        </div>
      </div>
    </div>
  );
};