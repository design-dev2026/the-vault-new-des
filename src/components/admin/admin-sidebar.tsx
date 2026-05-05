"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Shield, 
  ArrowLeft,
  ChevronRight,
  LogOut,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Package, label: "Items", href: "/admin/items" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-black text-white w-72 border-r border-white/10">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-10 w-10 bg-white rounded-sm flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
            <Shield className="h-6 w-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic leading-none">VAULT</h1>
            <span className="text-[8px] font-black tracking-[0.4em] uppercase text-white/40 block mt-1">Command</span>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-500 group",
                  isActive ? "bg-white text-black" : "text-white/40 hover:bg-white/5 hover:text-white"
                )}>
                  <div className="flex items-center gap-4">
                    <item.icon className={cn("h-4 w-4", isActive ? "text-black" : "text-white/20 group-hover:text-white")} />
                    <span className="text-label-caps text-[10px] tracking-[0.2em]">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-6">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
          <span className="text-label-caps text-white/20 text-[8px] tracking-[0.4em] uppercase block">Operations</span>
          <div className="space-y-4">
            <Link href="/app" className="group flex items-center gap-4 text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Exit App
            </Link>
            <Link href="/admin/settings" className="group flex items-center gap-4 text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest">
              <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Config
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
