"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function OverviewCharts({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
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
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "0px", fontSize: "10px" }}
          itemStyle={{ color: "#fff", textTransform: "uppercase", fontWeight: "bold" }}
        />
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="#ffffff" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorCount)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
