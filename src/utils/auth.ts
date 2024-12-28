import { supabase } from "@/integrations/supabase/client";

export const checkProfileCompletion = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }

    return !!profile?.first_name;
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

    if (data?.user) {
      return { user: data.user };
    }

    throw new Error("Failed to create user");
  } catch (error) {
    console.error("Error in createUserWithMetadata:", error);
    throw error;
  }
};