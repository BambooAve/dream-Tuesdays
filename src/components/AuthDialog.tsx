import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const AuthDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
        // Close the dialog
        onClose();
        
        if (session?.user) {
          // Check if profile exists and is complete
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', session.user.id)
            .single();

          if (!profile?.first_name) {
            navigate('/complete-profile');
          } else {
            navigate('/profile');
          }

          toast({
            title: "Welcome!",
            description: profile?.first_name 
              ? "Successfully signed in." 
              : "Please complete your profile.",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, onClose, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogTitle className="text-center mb-4">Welcome Back</DialogTitle>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: '#000',
                color: 'white',
                borderRadius: '9999px',
              },
              anchor: {
                color: '#000',
              },
              input: {
                color: '#000',
              },
            },
          }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
        />
      </DialogContent>
    </Dialog>
  );
};