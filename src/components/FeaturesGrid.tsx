import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Bot, CheckSquare, BarChart3, MessageCircleHeart, Calendar } from "lucide-react";

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
  return (
    <section className="py-24 bg-white" id="signup-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <div className="p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
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