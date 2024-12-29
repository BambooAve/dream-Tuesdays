import { useEffect, useRef } from "react";
import p5 from "p5";
import { Button } from "./ui/button";

export const VisionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let shapes: Array<{
        x: number;
        y: number;
        rotation: number;
        size: number;
        type: 'cube' | 'sphere' | 'pyramid';
      }> = [];

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, 400, p.WEBGL);
        canvas.parent(containerRef.current!);
        
        // Create initial shapes
        for (let i = 0; i < 5; i++) {
          shapes.push({
            x: p.random(-p.width/2, p.width/2),
            y: p.random(-200, 200),
            rotation: p.random(p.TWO_PI),
            size: p.random(20, 40),
            type: ['cube', 'sphere', 'pyramid'][Math.floor(p.random(3))] as any
          });
        }
      };

      p.draw = () => {
        p.clear();
        p.noStroke();
        p.ambientLight(60);
        p.directionalLight(255, 255, 255, 0, 0, -1);
        
        shapes.forEach(shape => {
          p.push();
          p.translate(shape.x, shape.y);
          p.rotateX(shape.rotation);
          p.rotateY(shape.rotation * 0.5);
          p.fill(255, 255, 255, 100);
          
          switch(shape.type) {
            case 'cube':
              p.box(shape.size);
              break;
            case 'sphere':
              p.sphere(shape.size/2);
              break;
            case 'pyramid':
              p.cone(shape.size/2, shape.size);
              break;
          }
          
          shape.rotation += 0.01;
          p.pop();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, 400);
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  const scrollToSignup = () => {
    const element = document.getElementById('signup-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 bg-gradient-to-br from-[#FF7F50] to-[#FF4500] py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Create a routine so good, Tuesday becomes your favorite day.
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            Your best life isn't about waiting for vacations—it's about making every day fulfilling.
          </p>
          <Button 
            onClick={scrollToSignup}
            className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full text-lg"
          >
            Start Building Your Dream Today
          </Button>
        </div>
      </div>
    </section>
  );
};