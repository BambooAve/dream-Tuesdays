import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { CategoriesGrid } from "@/components/Profile/CategoriesGrid";
import { AddGoalDialog } from "@/components/Profile/AddGoalDialog";
import { ProfileLayout } from "@/components/Profile/ProfileLayout";
import { Profile as ProfileType, Category, Goal } from "@/components/Profile/types";

export const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
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

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        
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

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", session.user.id);

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <ProfileHeader profile={profile} />
      <CategoriesGrid categories={categories} goals={goals} />
      <AddGoalDialog
        isOpen={isAddGoalOpen}
        onOpenChange={setIsAddGoalOpen}
        categories={categories}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        handleAddGoal={handleAddGoal}
      />
    </ProfileLayout>
  );
};

export default Profile;