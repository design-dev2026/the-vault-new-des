"use client";

import { useRef } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { Copy, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShareableCardProps {
  item: any;
}

export function ShareableCard({ item }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    
    const toastId = toast.loading("Generating image...");
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#000000",
        pixelRatio: 2,
      });
      
      const link = document.createElement("a");
      link.download = `vault-${item.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Image downloaded!", { id: toastId });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to generate image", { id: toastId });
    }
  };

  const properties = item.properties || {};

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-1000">
      {/* Card Container for Export */}
      <div 
        ref={cardRef} 
        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/10 group"
      >
        {/* Main Image */}
        <div className="absolute inset-0">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
              <Share2 className="h-20 w-20 text-white/5" />
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-3">
            {item.category}
          </span>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter italic leading-none mb-4">
            {item.name}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-white/60 text-sm mb-6">
            {(() => {
              const props = item.properties || {};
              const fields = [];
              
              switch (item.category) {
                case "statue":
                  fields.push({ label: "Art Style", value: props.art_style });
                  fields.push({ label: "Pose", value: props.pose });
                  fields.push({ label: "Scale", value: props.scale });
                  break;
                case "figure":
                  fields.push({ label: "Type", value: props.figure_type });
                  fields.push({ label: "Brand", value: props.manufacturer });
                  fields.push({ label: "Scale", value: props.scale });
                  break;
                case "hotwheel":
                  fields.push({ label: "Series", value: props.series });
                  fields.push({ label: "Year", value: props.year });
                  fields.push({ label: "Model", value: props.model_name });
                  break;
                case "lego":
                  fields.push({ label: "Theme", value: props.theme });
                  fields.push({ label: "Set No", value: props.set_number });
                  fields.push({ label: "Pieces", value: props.piece_count });
                  break;
                case "trading_card":
                  fields.push({ label: "Card Type", value: props.card_type });
                  fields.push({ label: "Rarity", value: props.rarity });
                  fields.push({ label: "Set", value: props.set_name });
                  break;
                case "sneakers":
                  fields.push({ label: "Model", value: props.model });
                  fields.push({ label: "Colour", value: props.colourway });
                  fields.push({ label: "Brand", value: props.brand });
                  break;
                case "video_game":
                  fields.push({ label: "Platform", value: props.platform });
                  fields.push({ label: "Region", value: props.region });
                  fields.push({ label: "Condition", value: props.condition });
                  break;
                case "watch":
                  fields.push({ label: "Brand", value: props.brand });
                  fields.push({ label: "Model", value: props.model });
                  fields.push({ label: "Movement", value: props.movement_type });
                  break;
                case "designer_toy":
                  fields.push({ label: "Artist", value: props.artist_studio });
                  fields.push({ label: "Series", value: props.series_name });
                  fields.push({ label: "Year", value: props.year_released });
                  break;
                default:
                  fields.push({ label: "Category", value: item.category });
              }

              return fields.filter(f => f.value).map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">{f.label}</span>
                  <span className="text-xs font-bold text-white uppercase">{f.value}</span>
                </div>
              ));
            })()}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div className="text-[8px] uppercase tracking-[0.4em] font-black text-white/20">
              Provenance Verified · <span className="text-white">VAULT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-1">
        <button 
          onClick={copyLink}
          className="h-16 border border-white/10 bg-white/[0.02] text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/5 transition-all flex items-center justify-center gap-3"
        >
          <Copy className="h-4 w-4" />
          Copy Link
        </button>
        <button 
          onClick={downloadImage}
          className="h-16 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-3"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}
