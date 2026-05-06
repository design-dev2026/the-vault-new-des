import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, DollarSign, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Collectible {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  current_value: number | null;
  cost_price: number | null;
  properties?: Record<string, any>;
}

export function ItemCard({ item, priority = false }: { item: Collectible, priority?: boolean }) {
  const displayValue = item.current_value || item.cost_price || 0;
  
  return (
    <div className="group relative glass-vault p-5 rounded hover:border-white/40 transition-all duration-1000 animate-in fade-in zoom-in-95 overflow-hidden">
      <Link href={`/app/items/${item.id}`}>
        <div className="aspect-[3/4] overflow-hidden mb-8 rounded-sm bg-black relative border border-white/5">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/5">
              <Package className="h-16 w-16 font-thin" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-4">
              <span className="text-label-caps text-white/40 block mb-1 truncate">
                {item.category}
              </span>
              <h4 className="text-white font-bold text-xl uppercase tracking-tighter truncate leading-none">
                {item.name}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-white font-black text-xl italic tracking-tighter block leading-none">
                ${displayValue.toLocaleString()}
              </span>
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1 block">EST. VALUE</span>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
              {item.properties?.condition || "ARCHIVAL MINT"}
            </span>
            <span className="w-[1px] h-3 bg-white/10"></span>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
              {item.properties?.edition_number ? `ED. ${item.properties.edition_number}` : "UNIQUE"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
