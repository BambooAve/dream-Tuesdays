import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.9)" }}
      >
        <source
          src="https://cdn.shopify.com/videos/c/o/v/72c436bca4ba4f2fb798991cbf856b13.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white">
          Craft Your Vision.
          <br />
          Achieve Your Goals.
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
          A minimalist approach to setting and achieving your most ambitious goals.
        </p>
        <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full text-lg">
          Get Started
        </Button>
      </div>
    </section>
  );
};