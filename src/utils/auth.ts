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
  const authData = isEmail 
    ? {
        email: identifier,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { email: identifier },
        },
      }
    : {
        phone: identifier,
        password,
        options: {
          data: { phone: identifier },
        },
      };

  const { data, error } = await supabase.auth.signUp(authData);
  
  if (error) throw error;
  return data;
};