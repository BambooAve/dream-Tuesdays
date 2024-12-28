import { supabase } from "@/integrations/supabase/client";

export const checkProfileCompletion = async (userId: string) => {
  try {
    // First ensure profile exists
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }

    // If no profile exists, create one
    if (!profile) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: userId }]);

      if (insertError) {
        console.error("Error creating profile:", insertError);
        return false;
      }

      return false; // New profile needs completion
    }

    return !!profile.first_name;
  } catch (error) {
    console.error("Error in checkProfileCompletion:", error);
    return false;
  }
};

export const createUserWithMetadata = async (
  identifier: string, 
  password: string, 
  isEmail: boolean
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      ...(isEmail ? { email: identifier } : { phone: identifier }),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: isEmail ? { email: identifier } : { phone: identifier },
      },
    });

    if (error) throw error;

    // Only return if we have both data and user
    if (data?.user) {
      // Ensure profile exists
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: data.user.id }])
        .select()
        .maybeSingle();

      if (profileError) {
        console.error("Error ensuring profile exists:", profileError);
      }

      return { user: data.user };
    }

    throw new Error("Failed to create user");
  } catch (error) {
    console.error("Error in createUserWithMetadata:", error);
    throw error;
  }
};