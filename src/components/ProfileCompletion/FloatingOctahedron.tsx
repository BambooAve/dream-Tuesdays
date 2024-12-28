import { useEffect, useRef } from "react";
import p5 from "p5";

export const FloatingOctahedron = () => {
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
        p.background(0, 0, 0, 0);
        p.rotateX(angle);
        p.rotateY(angle * 0.8);
        p.rotateZ(angle * 0.5);
        
        // Black octahedron with slight transparency
        p.fill(0, 0, 0, 220);
        p.octahedron(50);
        
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
      className="w-full h-[300px] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300"
      style={{
        animation: "float 6s ease-in-out infinite",
      }}
    />
  );
};