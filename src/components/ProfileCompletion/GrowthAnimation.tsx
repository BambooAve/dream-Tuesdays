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
        
        // Create a more organic shape using spheres and cylinders
        p.fill(0);
        
        // Main sphere at the center
        p.push();
        p.translate(0, 0, 0);
        p.sphere(40);
        p.pop();
        
        // Add growing branches with spheres at the tips
        const branches = 5;
        for (let i = 0; i < branches; i++) {
          const branchAngle = (p.TWO_PI * i) / branches;
          const height = 80 + p.sin(angle * 2) * 15;
          
          p.push();
          p.rotateY(branchAngle);
          p.rotateZ(p.PI / 4 + p.sin(angle) * 0.2);
          
          // Draw branch cylinder
          p.translate(0, -height/2, 0);
          p.cylinder(8, height);
          
          // Draw sphere at tip
          p.translate(0, -height/2, 0);
          p.sphere(15);
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