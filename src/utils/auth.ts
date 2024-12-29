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
    // First check if user exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      ...(isEmail 
        ? { email: identifier } 
        : { phone: identifier }
      ),
      password,
    });

    if (existingUser?.user) {
      throw new Error("User already registered");
    }

    // If user doesn't exist, proceed with sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      ...(isEmail 
        ? { email: identifier } 
        : { phone: identifier }
      ),
      password,
      options: {
        data: {
          ...(isEmail ? { email: identifier } : { phone: identifier })
        }
      }
    });

    if (signUpError) throw signUpError;
    
    if (!signUpData.user) {
      throw new Error("No user returned from sign up");
    }

    // Return the user data
    return { user: signUpData.user };
  } catch (error) {
    console.error("Error in createUserWithMetadata:", error);
    throw error;
  }
};