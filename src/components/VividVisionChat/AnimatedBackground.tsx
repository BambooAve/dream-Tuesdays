import { useEffect, useRef } from "react";
import p5 from "p5";

export const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const shapes: Array<{
        x: number;
        y: number;
        rotation: number;
        size: number;
        speed: number;
        type: 'triangle' | 'square';
      }> = [];
      
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);
        
        // Create initial shapes
        for (let i = 0; i < 30; i++) {
          shapes.push({
            x: p.random(p.width),
            y: p.random(p.height),
            rotation: p.random(p.TWO_PI),
            size: p.random(10, 30),
            speed: p.random(0.2, 1),
            type: p.random() > 0.5 ? 'triangle' : 'square'
          });
        }
      };

      p.draw = () => {
        p.clear();
        
        shapes.forEach(shape => {
          p.push();
          p.translate(shape.x, shape.y);
          p.rotate(shape.rotation);
          p.noStroke();
          p.fill(255, 255, 255, 15);
          
          if (shape.type === 'triangle') {
            p.triangle(
              -shape.size/2, shape.size/2,
              shape.size/2, shape.size/2,
              0, -shape.size/2
            );
          } else {
            p.rect(-shape.size/2, -shape.size/2, shape.size, shape.size);
          }
          
          p.pop();
          
          // Move shape up
          shape.y -= shape.speed;
          shape.rotation += 0.01;
          
          // Reset shape position when it goes off screen
          if (shape.y < -shape.size) {
            shape.y = p.height + shape.size;
            shape.x = p.random(p.width);
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