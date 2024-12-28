import { useEffect, useRef } from "react";
import p5 from "p5";

export const MenuOctahedron = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let angle = 0;

      p.setup = () => {
        const canvas = p.createCanvas(40, 40, p.WEBGL);
        canvas.parent(containerRef.current!);
        p.noStroke();
      };

      p.draw = () => {
        p.background(0, 0, 0, 0);
        p.rotateX(angle);
        p.rotateY(angle * 0.8);
        p.rotateZ(angle * 0.5);
        
        // Create octahedron-like shape using two cones
        p.push();
        p.fill(255, 255, 255, 220); // White with slight transparency
        p.cone(14, 14, 8, 1); // Top cone
        p.rotateX(p.PI); // Rotate 180 degrees
        p.cone(14, 14, 8, 1); // Bottom cone
        p.pop();
        
        // Animate rotation
        angle += 0.02;
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-10 h-10 flex items-center justify-center"
      style={{
        animation: "float 6s ease-in-out infinite",
      }}
    />
  );
};