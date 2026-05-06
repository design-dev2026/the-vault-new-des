import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Package, 
  ShieldCheck,
  Globe,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_REGISTRY, CategorySlug } from "@/registry/category-registry";

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

  const categorySlug = item.category as CategorySlug;
  const config = CATEGORY_REGISTRY[categorySlug];

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
          <div className="relative aspect-[3/4] rounded overflow-hidden bg-[#0A0A0A] border border-white/5 group">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
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
                <div key={i} className="relative aspect-square rounded overflow-hidden border border-white/5 bg-white/5 group cursor-pointer">
                  <Image
                    src={url}
                    alt={`${item.name} gallery ${i}`}
                    fill
                    className="object-cover transition-all duration-500"
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
                {config?.label || item.category}
              </span>
              <span className="w-12 h-[1px] bg-white/10"></span>
              <span className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase">
                {item.properties?.condition || item.properties?.figure_condition || "ARCHIVAL MINT"}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter italic leading-none">
              {item.name}
            </h1>
            {item.notes && (
              <p className="text-xl text-white/60 leading-relaxed max-w-2xl font-medium line-clamp-3">
                {item.notes}
              </p>
            )}
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

          {/* Detailed Specs from Registry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 pt-8">
            {config?.sections.map((section, idx) => {
              // Filter fields that have values in properties
              const activeFields = section.fields.filter(f => 
                item.properties?.[f.key] !== undefined && 
                item.properties?.[f.key] !== "" && 
                item.properties?.[f.key] !== null
              );

              if (activeFields.length === 0) return null;

              return (
                <section key={idx} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="text-label-caps text-white uppercase tracking-[0.3em] whitespace-nowrap">{section.title}</span>
                    <div className="flex-1 h-[1px] bg-white/5"></div>
                  </div>
                  <div className="space-y-6">
                    {activeFields.map((field, fIdx) => {
                      let displayValue = item.properties[field.key];
                      if (field.type === 'switch') displayValue = displayValue ? 'YES' : 'NO';
                      if (field.type === 'date' && displayValue) displayValue = new Date(displayValue).toLocaleDateString();
                      
                      return (
                        <div key={fIdx} className="flex justify-between items-baseline border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{field.label}</span>
                          <span className="text-sm font-bold text-white uppercase tracking-tight text-right max-w-[60%]">{displayValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

