import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  DollarSign, 
  Tag, 
  ExternalLink,
  Share2,
  Package,
  History,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let item = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("collectibles")
      .select("*")
      .eq("id", id)
      .single();
    item = data;
  } catch (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-black">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tighter italic">Archive Error</h1>
          <p className="text-white/40 text-sm">There was a problem accessing your collection. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  const profit = item.current_value && item.cost_price 
    ? item.current_value - item.cost_price 
    : 0;
  const profitPercentage = item.cost_price 
    ? (profit / item.cost_price) * 100 
    : 0;

  return (
    <div className="relative space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/app"
          className="group flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Return to Archive
        </Link>
        <div className="flex gap-4">
          <Link 
            href={`/app/items/${id}/edit`}
            className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold text-white/60 hover:text-white hover:border-white transition-all uppercase tracking-widest"
          >
            Modify Entry
          </Link>
          <Link 
            href={`/card/${id}`} 
            target="_blank"
            className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black hover:bg-neutral-200 transition-all uppercase tracking-widest"
          >
            Export ID
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Visual Archive (Left) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5 group">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/5">
                <Package className="h-32 w-32 font-thin" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-8 left-8">
              <span className="text-label-caps text-white/40 block mb-2">CATALOG NO.</span>
              <span className="text-xl font-bold text-white tracking-tighter">#{id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
          
          {item.gallery_urls && item.gallery_urls.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {item.gallery_urls.map((url: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 bg-white/5 group cursor-pointer">
                  <Image
                    src={url}
                    alt={`${item.name} gallery ${i}`}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Master Record (Right) */}
        <div className="lg:col-span-7 space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 border border-white/20 rounded-full text-[8px] font-black tracking-[0.2em] text-white/60 uppercase">
                {item.category}
              </span>
              <span className="w-12 h-[1px] bg-white/10"></span>
              <span className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase">
                {item.condition || "ARCHIVAL MINT"}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter italic leading-none">
              {item.name}
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl font-medium">
              {item.description || "Historical and aesthetic significance documentation pending."}
            </p>
          </header>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-4">
              <span className="text-label-caps text-white/40 uppercase block">Market Valuation</span>
              <div className="text-3xl font-bold text-white italic tracking-tighter">
                ${item.current_value?.toLocaleString() || "UNSET"}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-4">
              <span className="text-label-caps text-white/40 uppercase block">Acquisition Cost</span>
              <div className="text-3xl font-bold text-white/60 tracking-tighter">
                ${item.cost_price?.toLocaleString() || "UNSET"}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-4">
              <span className="text-label-caps text-white/40 uppercase block">Archival Growth</span>
              <div className={cn("text-3xl font-bold tracking-tighter italic", profit >= 0 ? "text-white" : "text-white/40")}>
                {profit >= 0 ? "+" : ""}{profitPercentage.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Detailed Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-caps text-white uppercase tracking-[0.3em]">Specifications</span>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Material Composition", value: item.properties?.material || "Composite" },
                  { label: "Lead Artisan", value: item.properties?.artist_name || item.properties?.sculptor || "Anonymous" },
                  { label: "Scale Framework", value: item.properties?.scale || "1:1" },
                  { label: "Archival Weight", value: item.properties?.weight_g ? `${item.properties.weight_g}g` : "Verified" },
                ].map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-baseline border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-sm font-bold text-white uppercase tracking-tight">{spec.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-label-caps text-white uppercase tracking-[0.3em]">Provenance</span>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Acquisition Date", value: item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : "Historical" },
                  { label: "Origin / Source", value: item.properties?.purchase_location || "Vault Acquisition" },
                  { label: "Edition Sequence", value: item.properties?.edition_number ? `${item.properties.edition_number} / ${item.properties.edition_run || '?'}` : "Unique Entry" },
                  { label: "Insurance Status", value: item.properties?.is_insured ? "SECURED" : "UNPROTECTED" },
                ].map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-baseline border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-sm font-bold text-white uppercase tracking-tight">{spec.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
