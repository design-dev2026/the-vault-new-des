import { serviceClient } from "@/lib/supabase/service";
export const dynamic = "force-dynamic";

import { ItemsTable } from "./items-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminItemsPage() {
  const supabase = serviceClient();

  // 1. Fetch all collectibles with profiles join
  // Note: Since we are using service role, we can join profiles easily
  const { data: items, error } = await supabase
    .from("collectibles")
    .select(`
      *,
      profiles:user_id (
        email,
        username,
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Archival Oversight</span>
        <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic">Item Moderation</h1>
      </header>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <span className="text-label-caps text-white uppercase tracking-[0.3em]">Global Inventory ({items?.length || 0})</span>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Asset Ledger</span>
        </div>
        <ItemsTable initialItems={items || []} />
      </div>
    </div>
  );
}
