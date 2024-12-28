import { CheckCircle, Target, Trophy } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Set Clear Goals",
    description: "Define your objectives with precision and purpose.",
  },
  {
    icon: CheckCircle,
    title: "Track Progress",
    description: "Monitor your journey with intuitive tracking tools.",
  },
  {
    icon: Trophy,
    title: "Achieve More",
    description: "Celebrate your successes and stay motivated.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-lg hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-6 text-teal-dark group-hover:text-teal" />
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};