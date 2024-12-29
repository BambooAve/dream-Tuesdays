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
    // Directly attempt to sign up the user
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

    if (signUpError) {
      // Check if error indicates user already exists
      if (signUpError.message?.includes("User already registered") ||
          signUpError.message?.includes("user already exists")) {
        throw new Error("User already registered");
      }
      throw signUpError;
    }
    
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