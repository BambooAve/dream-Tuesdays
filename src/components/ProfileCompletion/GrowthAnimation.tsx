import { useEffect, useRef } from 'react';
import p5 from 'p5';

export const GrowthAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let angle = 0;

      p.setup = () => {
        const canvas = p.createCanvas(300, 300, p.WEBGL);
        canvas.parent(containerRef.current!);
        p.noStroke();
      };

      p.draw = () => {
        p.background(0, 0);
        p.rotateY(angle);
        p.rotateX(angle * 0.3);
        
        p.fill(0);
        p.box(100);
        
        // Add growing branches
        for (let i = 0; i < 4; i++) {
          p.push();
          p.rotateY(p.PI * i / 2);
          p.translate(0, -50 - Math.sin(angle) * 20, 0);
          p.box(20, 100, 20);
          p.pop();
        }
        
        angle += 0.02;
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  return <div ref={containerRef} className="absolute right-10 top-1/2 -translate-y-1/2" />;
};