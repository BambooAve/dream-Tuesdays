import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
        <h1 className="text-4xl font-bold leading-tight">
          Imagine writing down exactly what your dream life looks like 365 days from now—and then actually living it.
        </h1>
        <p className="text-xl text-gray-300">
          That's what we're going to do today.
        </p>
        <div className="space-y-4">
          <p className="text-gray-400">
            This is your time to reflect, dream, and plan. The first step toward transformation is setting your intentions.
          </p>
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-full"
          >
            Start Now
          </Button>
        </div>
      </div>
    </div>
  );
};