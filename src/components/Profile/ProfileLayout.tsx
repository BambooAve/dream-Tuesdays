import { Navigation } from "@/components/Navigation";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-brand-orange via-brand-orange to-gray-100/20">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};