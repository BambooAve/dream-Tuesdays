import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-light/20 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          Craft Your Vision.
          <br />
          Achieve Your Goals.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          A minimalist approach to setting and achieving your most ambitious goals.
        </p>
        <Button className="bg-black text-white hover:bg-black/90 px-8 py-6 rounded-full text-lg">
          Get Started
        </Button>
      </div>
    </section>
  );
};