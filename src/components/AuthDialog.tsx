import { ModernAuthDialog } from "./auth/ModernAuthDialog";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  return <ModernAuthDialog isOpen={isOpen} onOpenChange={onOpenChange} />;
}