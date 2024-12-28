import { supabase } from "@/integrations/supabase/client";

export const checkProfileCompletion = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }

  return !!profile?.first_name;
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

    // Return only if we have both data and user
    if (data && data.user) {
      return { user: data.user };
    }

    throw new Error("Failed to create user");
  } catch (error) {
    console.error("Error in createUserWithMetadata:", error);
    throw error;
  }
};