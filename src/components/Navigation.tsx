import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
          <Menu className="text-white w-5 h-5" />
        </button>
        <Button variant="ghost" className="text-sm font-medium">
          Sign In
        </Button>
      </div>
    </nav>
  );
};