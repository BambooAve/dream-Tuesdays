import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-4 p-6">
      <h3 className="text-xl font-semibold text-white/90">
        Start your journey by setting goals with Jaxon
      </h3>
      <p className="text-white/70">
        Click below to begin a conversation and create personalized goals for each category
      </p>
      <Button
        onClick={() => navigate('/vivid-vision')}
        size="lg"
        className="bg-white text-black hover:bg-white/90"
      >
        <MessageSquarePlus className="mr-2 h-5 w-5" />
        Chat with Jaxon
      </Button>
    </div>
  );
};