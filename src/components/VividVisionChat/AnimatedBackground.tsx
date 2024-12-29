import { useEffect, useRef } from "react";
import p5 from "p5";

export const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const particles: Array<{
        x: number;
        y: number;
        size: number;
        speed: number;
      }> = [];
      
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);
        
        // Create initial particles
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            size: p.random(2, 6),
            speed: p.random(0.2, 1)
          });
        }
      };

      p.draw = () => {
        p.clear();
        
        particles.forEach(particle => {
          p.noStroke();
          p.fill(255, 255, 255, 30);
          p.circle(particle.x, particle.y, particle.size);
          
          // Move particle up
          particle.y -= particle.speed;
          
          // Reset particle position when it goes off screen
          if (particle.y < -10) {
            particle.y = p.height + 10;
            particle.x = p.random(p.width);
          }
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />;
};