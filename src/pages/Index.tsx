import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { VisionSection } from "@/components/VisionSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <VisionSection />
      <FeaturesGrid />
      <Footer />
    </div>
  );
};

export default Index;