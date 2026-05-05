import { createClient } from "@/lib/supabase/server";
import { ItemCard } from "@/components/collectors/item-card";
import { Search, Filter, Grid, List as ListIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CollectiblesPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("collectibles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* Header & Filter Bar */}
      <header className="space-y-12">
        <div className="space-y-4">
          <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Archive Inventory</span>
          <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic">The Collection</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
          <div className="relative flex-1 w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Search by title, series, or artisan..." 
              className="w-full bg-black border border-white/10 rounded-xl h-12 pl-12 pr-4 text-sm text-white focus:border-white transition-all outline-none placeholder:text-white/10"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {["All", "Statue", "Figure", "Hotwheel"].map((cat) => (
              <button 
                key={cat}
                className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold text-white/40 hover:text-white hover:border-white transition-all uppercase tracking-widest whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
            <button className="p-3 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items?.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {items?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
          <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center text-white/5">
            <Grid className="h-12 w-12 font-thin" />
          </div>
          <p className="text-label-caps text-white/20 tracking-[0.3em] uppercase">No assets found in vault</p>
        </div>
      )}
    </div>
  );
}
