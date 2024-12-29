import { LucideIcon } from "lucide-react";

interface CategoryTileProps {
  name: string;
  description: string;
  Icon: LucideIcon;
}

export const CategoryTile = ({ name, description, Icon }: CategoryTileProps) => {
  return (
    <div className="p-6 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
      <div className="space-y-4">
        <div className="p-3 rounded-full bg-brand-primary/10 w-fit">
          <Icon className="h-6 w-6 text-brand-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-brand-secondary">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <button
          disabled
          className="w-full px-4 py-2 text-sm text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
        >
          Add Goals
        </button>
      </div>
    </div>
  );
};