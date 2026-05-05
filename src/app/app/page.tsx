"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Loader2,
  Package,
  PlusCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemCard } from "@/components/collectors/item-card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase, session } = useSupabase();

  useEffect(() => {
    async function fetchItems() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("collectibles")
          .select("*")
          .order("current_value", { ascending: false });

        if (!error && data) {
          setItems(data);
        }
      } catch (e) {
        console.error("Error fetching items:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [supabase, session]);

  const totalValue = items.reduce((acc, item) => acc + (Number(item.current_value) || Number(item.cost_price) || 0), 0);
  const totalInvestment = items.reduce((acc, item) => acc + (Number(item.cost_price) || 0), 0);
  const profitLoss = totalInvestment > 0 ? ((totalValue - totalInvestment) / totalInvestment) * 100 : 0;

  // Mock chart data (in a real app, this would be historical snapshots)
  const chartData = [
    { name: "JAN", value: totalValue * 0.7 },
    { name: "MAR", value: totalValue * 0.75 },
    { name: "MAY", value: totalValue * 0.85 },
    { name: "JUL", value: totalValue * 0.82 },
    { name: "SEP", value: totalValue * 0.92 },
    { name: "NOV", value: totalValue },
  ];

  // Allocation data
  const categories = Array.from(new Set(items.map(i => i.category)));
  const allocationData = categories.map(cat => ({
    name: cat.toUpperCase(),
    value: items.filter(i => i.category === cat).reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  })).sort((a, b) => b.value - a.value);

  const COLORS = ["#FFFFFF", "#353535", "#1F1F1F", "#8E9192"];

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse">
        <Skeleton className="h-24 w-2/3 bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Skeleton className="md:col-span-8 h-[400px] bg-white/5" />
          <Skeleton className="md:col-span-4 h-[400px] bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-24 animate-in fade-in duration-1000">
      {/* Vault Status Hero */}
      <section className="space-y-8">
        <div className="space-y-4">
          <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Archive Valuation Status</span>
          <h1 className="text-[80px] md:text-[120px] font-black text-white leading-none tracking-tighter uppercase italic">
            ${totalValue.toLocaleString()}
          </h1>
        </div>
        <div className="flex items-center gap-8 border-t border-white/5 pt-8">
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-2xl font-black italic tracking-tighter",
              profitLoss >= 0 ? "text-white" : "text-white/40"
            )}>
              {profitLoss >= 0 ? "+" : ""}{profitLoss.toFixed(1)}%
            </span>
            <span className="text-label-caps text-white/20 uppercase tracking-widest font-bold">Performance ROI</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white italic tracking-tighter">{items.length}</span>
            <span className="text-label-caps text-white/20 uppercase tracking-widest font-bold">Secured Assets</span>
          </div>
        </div>
      </section>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 items-stretch">
        {/* Performance Curve */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 p-10 space-y-12">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-label-caps text-white uppercase tracking-[0.3em]">Value Appreciation</span>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Historical Portfolio Trajectory</p>
            </div>
            <div className="flex gap-1">
              {["1Y", "ALL"].map((p) => (
                <button key={p} className="text-[10px] font-black px-4 py-2 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all uppercase">{p}</button>
              ))}
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#666", fontSize: 9, fontWeight: 900 }}
                  dy={10}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FFFFFF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Allocation */}
        <div className="lg:col-span-4 bg-white text-black p-10 space-y-12">
          <div className="space-y-2">
            <span className="text-label-caps text-black/60 uppercase tracking-[0.3em]">Allocation</span>
            <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">Asset Type Distribution</p>
          </div>
          
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#000000", "#333333", "#666666", "#999999"][index % 4]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-black font-black text-3xl italic tracking-tighter">
                {allocationData.length > 0 ? Math.round((allocationData[0].value / totalValue) * 100) : 0}%
              </span>
              <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em]">
                {allocationData[0]?.name || "EMPTY"}
              </span>
            </div>
          </div>
          
          <div className="space-y-4 border-t border-black/10 pt-8">
            {allocationData.slice(0, 3).map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#000000", "#333333", "#666666", "#999999"][index % 4] }} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{entry.name}</span>
                </div>
                <span className="font-black italic tracking-tighter">
                  ${entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apex Assets Section */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Archive Preview</span>
            <h2 className="text-5xl font-bold text-white uppercase tracking-tighter italic leading-none">Apex Assets</h2>
          </div>
          <Link 
            href="/app/collectibles" 
            className="group flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-white/60 hover:text-white transition-all uppercase"
          >
            Access Full Archive
            <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl text-center space-y-6">
            <Package className="h-16 w-16 text-white/5 font-thin" />
            <div className="space-y-2">
              <p className="text-label-caps text-white/20 tracking-[0.3em] uppercase">The vault is currently vacant</p>
              <Link href="/app/add" className="inline-block text-[10px] font-black text-white uppercase tracking-[0.2em] border-b border-white pb-1 hover:text-white/60 hover:border-white/60 transition-all">
                Initialize Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.slice(0, 4).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* High-End Floating Action */}
      <div className="fixed bottom-12 right-12 z-50">
        <Link 
          href="/app/add" 
          className="flex items-center gap-4 bg-white text-black pl-8 pr-6 py-4 rounded-full shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-all active:scale-95 group"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Asset</span>
          <div className="bg-black text-white rounded-full p-2 group-hover:rotate-90 transition-transform duration-500">
            <Plus className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
