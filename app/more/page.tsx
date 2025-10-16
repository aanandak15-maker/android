import {
  CloudRain,
  DollarSign,
  Droplets,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const menuItems = [
  {
    icon: CloudRain,
    label: "Weather",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Droplets,
    label: "Irrigation",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: DollarSign,
    label: "Market Prices",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Users,
    label: "Expert Consultation",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Sparkles,
    label: "AI Dashboard",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Settings,
    label: "Settings",
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
];

export default function MorePage() {
  return (
    <div className="min-h-screen p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">More Features</h1>
        <p className="text-sm text-gray-600">Additional modules and settings</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className={`p-4 ${item.bg} border-gray-200 cursor-pointer hover:shadow-md transition-shadow`}
            >
              <Icon className={`w-8 h-8 ${item.color} mb-2`} />
              <h3 className="font-semibold text-sm">{item.label}</h3>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
