import { useEffect, useRef } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export const ParticleBackground = () => {
  const particles = useRef<Particle[]>([]);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.current.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-0.5, 0.5),
        vy: p5.random(-0.5, 0.5),
        size: p5.random(3, 8),
      });
    }
  };

  const draw = (p5: p5Types) => {
    p5.clear();
    
    // Update mouse position with lerp for smooth movement
    mouseX.current = p5.lerp(mouseX.current, p5.mouseX, 0.1);
    mouseY.current = p5.lerp(mouseY.current, p5.mouseY, 0.1);

    // Update and draw particles
    particles.current.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen
      if (particle.x < 0) particle.x = p5.width;
      if (particle.x > p5.width) particle.x = 0;
      if (particle.y < 0) particle.y = p5.height;
      if (particle.y > p5.height) particle.y = 0;

      // Calculate distance to mouse
      const dx = mouseX.current - particle.x;
      const dy = mouseY.current - particle.y;
      const distance = p5.sqrt(dx * dx + dy * dy);

      // Draw particle
      const alpha = p5.map(distance, 0, 300, 100, 20);
      p5.noStroke();
      p5.fill(45, 212, 191, alpha); // Using teal color
      p5.circle(particle.x, particle.y, particle.size); // Fixed: Providing x, y, and diameter arguments

      // Draw connections
      particles.current.forEach((other) => {
        const d = p5.dist(particle.x, particle.y, other.x, other.y);
        if (d < 100) {
          const alpha = p5.map(d, 0, 100, 50, 0);
          p5.stroke(45, 212, 191, alpha);
          p5.line(particle.x, particle.y, other.x, other.y);
        }
      });
    });
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return (
    <div className="fixed inset-0 -z-10">
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
};