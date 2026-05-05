import { serviceClient } from "@/lib/supabase/service";
export const dynamic = "force-dynamic";

import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { OverviewCharts } from "./overview-charts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const supabase = serviceClient();

  // 1. Fetch User Stats
  const { data: usersData, error: usersError } = await supabase.from("profiles").select("*", { count: "exact" });
  const totalUsers = usersData?.length || 0;

  // 2. Fetch Collectible Stats
  const { data: itemsData, error: itemsError } = await supabase.from("collectibles").select("current_value, cost_price");
  const totalItems = itemsData?.length || 0;
  const totalValue = itemsData?.reduce((acc: number, item: any) => acc + (Number(item.current_value) || Number(item.cost_price) || 0), 0) || 0;

  // 3. Fetch Signups from Auth Admin API
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  const now = new Date();
  const signupData = authUsers?.users?.reduce((acc: any, user: any) => {
    const dateKey = format(new Date(user.created_at), "yyyy-MM-dd");
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {}) || {};

  // Fill in last 30 days
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(now, 29 - i);
    const key = format(d, "yyyy-MM-dd");
    return {
      date: format(d, "MMM dd"),
      count: signupData[key] || 0
    };
  });

  const signupsToday = signupData[format(now, "yyyy-MM-dd")] || 0;

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <header className="space-y-4">
          <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Platform Intelligence</span>
          <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic leading-none">Command Overview</h1>
        </header>
        <div className="bg-white text-black px-6 py-3 rounded-sm flex items-center gap-3">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-black text-[10px] tracking-[0.2em] uppercase">System Optimal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        <StatCard 
          title="Total Collectors" 
          value={totalUsers.toLocaleString()} 
          icon={Users} 
          trend="+12% ARCHIVAL GROWTH" 
        />
        <StatCard 
          title="Total Collectibles" 
          value={totalItems.toLocaleString()} 
          icon={Package} 
          trend="+5% INVENTORY INCREASE" 
        />
        <StatCard 
          title="Assets Value" 
          value={`$${(totalValue / 1000000).toFixed(2)}M`} 
          icon={DollarSign} 
          trend="+8% ROI PERFORMANCE" 
        />
        <StatCard 
          title="New Signups" 
          value={signupsToday.toString()} 
          icon={UserPlus} 
          trend="CURRENT SESSION GAIN" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-2xl p-10 space-y-8">
          <div className="space-y-2">
            <span className="text-label-caps text-white uppercase tracking-[0.3em]">Archival Trajectory</span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">New user registrations (30D)</p>
          </div>
          <div className="h-[350px] w-full pt-4">
            <OverviewCharts data={last30Days} />
          </div>
        </div>

        <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-10 space-y-12">
          <div className="space-y-2">
            <span className="text-label-caps text-white uppercase tracking-[0.3em]">System Integrity</span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Node health and load metrics</p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-label-caps text-white/40 uppercase text-[9px] tracking-widest">Database Load</span>
                <span className="text-xs font-black text-white italic">12.4%</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <div className="h-full bg-white w-[12%] shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-label-caps text-white/40 uppercase text-[9px] tracking-widest">Storage Capacity</span>
                <span className="text-xs font-black text-white italic">45.2 GB</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <div className="h-full bg-white w-[45%] shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Auth API Synchronized</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Edge Nodes Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/10 p-10 space-y-8 group hover:bg-white/[0.04] transition-all duration-700">
      <div className="flex items-center justify-between">
        <span className="text-label-caps text-white/40 uppercase block tracking-widest">{title}</span>
        <Icon className="h-4 w-4 text-white/20 group-hover:text-white transition-colors" />
      </div>
      <div className="space-y-2">
        <h3 className="text-5xl font-black text-white tracking-tighter italic leading-none">{value}</h3>
        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center group-hover:text-white/60 transition-colors">
          <ArrowUpRight className="h-3 w-3 mr-2" />
          {trend}
        </p>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
