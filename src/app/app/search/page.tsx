"use client";

import { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon, Filter, X, SlidersHorizontal, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ItemCard } from "@/components/collectors/item-card";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { supabase, session } = useSupabase();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 10000);

    async function fetchItems() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("collectibles")
          .select("*")
          .eq("user_id", session.user.id);

        if (!error && data) {
          setItems(data);
        }
      } catch (e) {
        console.error("Error fetching search items:", e);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    }
    fetchItems();
    return () => clearTimeout(timeout);
  }, [supabase, session]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                          (item.properties?.manufacturer?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                          (item.properties?.series_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, categoryFilter]);

  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Deep Archive Query</span>
        <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic">Search Vault</h1>
      </header>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
            <input 
              placeholder="Query by name, series, or archival number..." 
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl h-16 pl-16 pr-12 text-lg text-white focus:border-white transition-all outline-none placeholder:text-white/10 italic"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="h-16 px-8 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-neutral-200 transition-all">
                <SlidersHorizontal className="h-4 w-4" />
                Parameters
              </button>
            </SheetTrigger>
            <SheetContent className="bg-black/90 border-l border-white/10 backdrop-blur-3xl text-white">
              <SheetHeader className="space-y-4 border-b border-white/5 pb-8">
                <SheetTitle className="text-2xl font-bold uppercase tracking-tighter italic text-white">Query Parameters</SheetTitle>
                <SheetDescription className="text-label-caps text-white/40 uppercase tracking-widest">Narrow the archival search</SheetDescription>
              </SheetHeader>
              <div className="py-12 space-y-12">
                <div className="space-y-4">
                  <label className="text-label-caps text-white/60 uppercase tracking-[0.3em] text-[10px] block">Category Specification</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 text-[10px] font-bold uppercase tracking-widest text-white">
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      <SelectItem value="all">Unfiltered Archive</SelectItem>
                      <SelectItem value="statue">Archival Statues</SelectItem>
                      <SelectItem value="figure">Action Figures</SelectItem>
                      <SelectItem value="hotwheel">Automotive Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-12 border-t border-white/5">
                <button 
                  className="w-full h-14 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white/5 transition-all" 
                  onClick={() => { setCategoryFilter("all"); setSearchQuery(""); }}
                >
                  Reset Parameters
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Showing <span className="text-white italic">{filteredItems.length}</span> documented assets
          </p>
          {(searchQuery || categoryFilter !== "all") && (
            <button 
              onClick={() => { setCategoryFilter("all"); setSearchQuery(""); }} 
              className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest underline underline-offset-8"
            >
              Flush Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
            <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center text-white/5">
              <Package className="h-12 w-12 font-thin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-label-caps text-white/40 uppercase tracking-[0.4em]">Zero Assets Identified</h3>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest max-w-xs mx-auto">
                No records match the current query parameters.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
