import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
            },
          }}
          theme="light"
          providers={[]}
        />
      </DialogContent>
    </Dialog>
  );
};