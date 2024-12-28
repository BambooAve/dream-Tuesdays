import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FullscreenMenu } from "./FullscreenMenu";
import { AuthDialog } from "./AuthDialog";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            onClick={() => setIsMenuOpen(true)}
          />
          <Button 
            variant="ghost" 
            className="text-sm font-medium text-white hover:bg-white/10"
            onClick={() => setIsAuthOpen(true)}
          >
            Sign In
          </Button>
        </div>
      </nav>
      <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};