"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useEffect, useState } from "react";

export function TopAppBar() {
  const pathname = usePathname();
  const { user, profile } = useSupabase();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "DASHBOARD", href: "/app" },
    { name: "COLLECTION", href: "/app/collectibles" },
    { name: "ANALYTICS", href: "/app/portfolio" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-700 h-20 border-b",
        scrolled 
          ? "bg-black/90 backdrop-blur-2xl border-white/10" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="flex justify-between items-center px-8 h-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-white active:opacity-70">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/app" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
              <div className="w-4 h-4 border-2 border-black"></div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              VAULT
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] font-black tracking-[0.3em] transition-all duration-500 uppercase",
                  isActive ? "text-white" : "text-white/20 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/app/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{profile?.full_name || "MASTER"}</p>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Archivist</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-white transition-all duration-500 bg-white/5 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale"
                />
              ) : (
                <User className="h-4 w-4 text-white/40 group-hover:text-white" />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
