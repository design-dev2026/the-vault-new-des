"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  Loader2,
  ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { motion, useSpring, useTransform, animate } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useCollectionStats } from "@/hooks/useCollectionStats";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const COLORS = ["#FF6B6B", "#4ECDC4", "#1A1A2E", "#2D3436", "#95A5A6"];

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const { supabase, session } = useSupabase();

  useEffect(() => {
    setHasMounted(true);
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted && loading) setLoading(false);
    }, 10000);

    async function fetchItems() {
      if (!session?.user?.id || items.length > 0) {
        if (!session?.user?.id && isMounted) setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("collectibles")
          .select("*")
          .eq("user_id", session.user.id);

        if (isMounted && !error && data) {
          setItems(data);
        }
      } catch (e) {
        console.error("Error fetching portfolio items:", e);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    }
    fetchItems();
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [supabase, session?.user?.id]);

  const stats = useCollectionStats(items);

  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="md:col-span-2 h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-24">
      {/* Editorial Header */}
      <header className="space-y-4">
        <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Financial Intelligence</span>
        <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic leading-none">Portfolio Dossier</h1>
        <p className="text-xl text-white/40 max-w-2xl font-medium">Real-time valuation and growth metrics for the vault's assets.</p>
      </header>

      {/* Vault Statement (Hero Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
        <div className="md:col-span-2 bg-white text-black p-10 space-y-8 flex flex-col justify-between">
          <div>
            <span className="text-label-caps text-black/60 uppercase block tracking-widest">Total Vault Valuation</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-7xl font-black italic tracking-tighter">
                $<AnimatedNumber value={stats.totalValue} />
              </span>
            </div>
          </div>
          <div className="flex gap-12 border-t border-black/10 pt-8">
            <div>
              <span className="text-label-caps text-black/40 uppercase block mb-2">Net Growth</span>
              <p className={cn("text-2xl font-bold tracking-tighter italic", stats.profitLoss >= 0 ? "text-black" : "text-neutral-500")}>
                {stats.profitLoss >= 0 ? "+" : ""}${Math.abs(stats.profitLoss).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-label-caps text-black/40 uppercase block mb-2">ROI Performance</span>
              <p className={cn("text-2xl font-bold tracking-tighter italic", stats.roi >= 0 ? "text-black" : "text-neutral-500")}>
                {stats.roi.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-10 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-label-caps text-white/40 uppercase block">Investment</span>
            <DollarSign className="h-4 w-4 text-white/20" />
          </div>
          <h3 className="text-4xl font-bold text-white tracking-tighter italic">${stats.totalInvestment.toLocaleString()}</h3>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Cost Basis</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-10 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-label-caps text-white/40 uppercase block">Archival Count</span>
            <Package className="h-4 w-4 text-white/20" />
          </div>
          <h3 className="text-4xl font-bold text-white tracking-tighter italic">{items.length}</h3>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Assets Documented</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Growth Curve */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-label-caps text-white uppercase tracking-[0.3em]">Performance Curve</span>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Historical Cumulative Value</p>
            </div>
            <TrendingUp className="h-4 w-4 text-white/20" />
          </div>
          <div className="h-[400px] w-full pt-4 min-h-0">
            {hasMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.valueOverTime}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 10" vertical={false} stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: "#666", fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: "#666", fontWeight: "bold" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "0px", fontSize: "10px" }}
                  itemStyle={{ color: "#fff", textTransform: "uppercase", fontWeight: "bold" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          </div>
        </div>

        {/* Allocation */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-8">
          <div className="space-y-1">
            <span className="text-label-caps text-white uppercase tracking-[0.3em]">Asset Allocation</span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Value Distribution</p>
          </div>
          <div className="h-[250px] relative min-h-0">
            {hasMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#ffffff", "#666666", "#333333", "#111111"][index % 4]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
          </div>
          <div className="space-y-4">
            {stats.categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#ffffff", "#666666", "#333333", "#111111"][index % 4] }} />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{entry.name}s</span>
                </div>
                <span className="text-xs font-black text-white italic tracking-tighter">${(entry.value as any).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Ledger */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-label-caps text-white uppercase tracking-[0.3em]">Inventory Ledger</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Asset Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Investment</th>
                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Current Valuation</th>
                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Net Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.topItems.map((item) => {
                const itemProfit = (item.current_value || item.cost_price || 0) - (item.cost_price || 0);
                const itemRoi = item.cost_price && item.cost_price > 0 ? (itemProfit / item.cost_price) * 100 : 0;
                return (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6 font-bold text-white uppercase tracking-tight group-hover:text-white transition-all">
                      {item.name}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-white/60 font-medium">
                      ${item.cost_price?.toLocaleString() || "UNSET"}
                    </td>
                    <td className="px-8 py-6 text-right font-black text-white italic tracking-tighter">
                      ${(item.current_value || item.cost_price || 0).toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest italic",
                        itemRoi >= 0 ? "text-white" : "text-white/20"
                      )}>
                        {itemRoi >= 0 ? "+" : ""}{itemRoi.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}
