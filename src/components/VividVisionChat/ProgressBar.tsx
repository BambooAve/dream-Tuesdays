import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 p-4 z-10">
      <Progress value={progress} className="h-2 bg-white/10" />
      <p className="text-sm text-white/60 mt-2 text-center">
        Vision Progress: {progress}%
      </p>
    </div>
  );
};