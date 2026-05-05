"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, PlusCircle, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavBar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, href: "/app" },
    { icon: BarChart2, href: "/app/portfolio" },
    { icon: PlusCircle, href: "/app/add", isLarge: true },
    { icon: Search, href: "/app/collectibles" },
    { icon: User, href: "/app/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full h-24 bg-black/95 backdrop-blur-3xl flex justify-around items-center px-8 pb-6 border-t border-white/5 z-50">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={index}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-500 cursor-pointer",
              isActive ? "text-white scale-110" : "text-white/20 hover:text-white/60",
              item.isLarge && "scale-125"
            )}
          >
            <Icon className={cn(item.isLarge ? "h-8 w-8" : "h-5 w-5")} strokeWidth={isActive ? 2.5 : 2} />
            {isActive && !item.isLarge && (
              <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
