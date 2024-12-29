import { useEffect, useRef } from "react";
import p5 from "p5";

interface BenefitShapeProps {
  type: "sphere" | "cube" | "pyramid" | "torus" | "cylinder";
}

export const BenefitShape = ({ type }: BenefitShapeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let angle = 0;

      p.setup = () => {
        const canvas = p.createCanvas(80, 80, p.WEBGL);
        canvas.parent(containerRef.current!);
        p.noStroke();
      };

      p.draw = () => {
        p.background(255, 255, 255, 0);
        p.rotateX(angle);
        p.rotateY(angle * 0.8);
        p.ambientLight(100);
        p.directionalLight(255, 255, 255, 0, 0, 1);
        
        p.fill(255, 100, 51); // #FF6433
        
        switch (type) {
          case "sphere":
            p.sphere(30);
            break;
          case "cube":
            p.box(40);
            break;
          case "pyramid":
            p.cone(30, 50, 4, 1);
            break;
          case "torus":
            p.torus(20, 10);
            break;
          case "cylinder":
            p.cylinder(20, 40);
            break;
        }
        
        angle += 0.02;
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, [type]);

  return (
    <div 
      ref={containerRef}
      className="w-20 h-20 flex items-center justify-center"
      style={{ animation: "float 6s ease-in-out infinite" }}
    />
  );
};