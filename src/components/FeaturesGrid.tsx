import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Bot, CheckSquare, BarChart3, MessageCircleHeart, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";
import p5 from "p5";

const features = [
  {
    title: "AI Life Coach",
    icon: Bot,
    description: "Personalized guidance to set and achieve meaningful goals.",
    details: "Get tailored advice and actionable steps to reach your full potential."
  },
  {
    title: "Daily Accountability",
    icon: CheckSquare,
    description: "Track your daily tasks and habits with ease.",
    details: "Stay on top of your goals with our intuitive tracking system."
  },
  {
    title: "Progress Dashboard",
    icon: BarChart3,
    description: "Visualize your weekly and monthly growth.",
    details: "See your progress through beautiful, insightful charts and metrics."
  },
  {
    title: "Motivational Messages",
    icon: MessageCircleHeart,
    description: "Stay inspired with tailored encouragements.",
    details: "Receive personalized motivation exactly when you need it most."
  },
  {
    title: "Habit Builder",
    icon: Calendar,
    description: "Build habits that stick and drive lasting change.",
    details: "Create and maintain positive habits with our proven system."
  }
];

export const FeaturesGrid = () => {
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
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        canvas.parent(containerRef.current!);
        
        // Create initial shapes
        for (let i = 0; i < 8; i++) {
          shapes.push({
            x: p.random(-p.width/2, p.width/2),
            y: p.random(-p.height/2, p.height/2),
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
          p.fill(255, 127, 80, 100);
          
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
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" id="signup-section">
      <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <div className="p-8 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <feature.icon className="w-12 h-12 mb-4 text-[#FF4500]" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.details}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
};