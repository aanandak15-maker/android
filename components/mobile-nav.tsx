"use client";

import { Camera, Home, Menu, Sprout, TrendingUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    href: "/soil",
    label: "Soil",
    icon: Sprout,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    href: "/yield",
    label: "Yield",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    href: "/disease",
    label: "Disease",
    icon: Camera,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    href: "/more",
    label: "More",
    icon: Menu,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`
                flex flex-col items-center justify-center flex-1 py-2 transition-colors
                ${isActive ? `${item.color} ${item.bg}` : "text-gray-600 hover:text-gray-900"}
              `}
              aria-label={item.label}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
