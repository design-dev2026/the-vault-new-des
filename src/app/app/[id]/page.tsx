"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Share2, 
  Calendar, 
  DollarSign, 
  Box, 
  Info,
  Maximize2,
  ShieldCheck,
  Tag,
  Loader2,
  Package,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabase } from "@/components/providers/supabase-provider";
import { cn } from "@/lib/utils";

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      if (!session?.user?.id || !id) return;

      const { data, error } = await supabase
        .from("collectibles")
        .select("*")
        .eq("id", id)
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        toast.error("Item not found");
        router.push("/");
        return;
      }

      setItem(data);
      setHeroImage(data.image_url);
      setLoading(false);
    }

    fetchItem();
  }, [id, supabase, session, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // 1. Delete from storage (gallery and primary)
      const imagesToDelete = [item.image_url, ...(item.gallery_urls || [])].filter(Boolean);
      for (const url of imagesToDelete) {
        const path = url.split("/storage/v1/object/public/collectible-images/")[1];
        if (path) {
          await supabase.storage.from("collectible-images").remove([path]);
        }
      }

      // 2. Delete from DB
      const { error } = await supabase.from("collectibles").delete().eq("id", id);
      if (error) throw error;

      toast.success("Item removed from vault");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  const properties = item.properties || {};
  
  const infoGrid = [
    { label: "Manufacturer", value: properties.manufacturer },
    { label: "License", value: properties.license_holder },
    { label: "Series", value: properties.series_name },
    { label: "Edition", value: properties.edition },
    { label: "Scale", value: properties.scale },
    { label: "Material", value: properties.material },
    { label: "Sculptor", value: properties.sculptor },
    { 
      label: "Dimensions", 
      value: properties.height_cm ? `${properties.height_cm} x ${properties.width_cm || '?'} x ${properties.depth_cm || '?'} cm` : null 
    },
    { label: "Weight", value: properties.weight_g ? `${properties.weight_g} g` : null },
    { 
      label: "Edition Info", 
      value: properties.edition_number ? `${properties.edition_number} / ${properties.edition_run || '?'}` : (properties.edition_run ? `ES ${properties.edition_run}` : null) 
    },
    { label: "Art Style", value: properties.art_style },
    { label: "Pose", value: properties.pose },
    { label: "Box Condition", value: properties.box_condition },
    { label: "Item Condition", value: properties.figure_condition },
    { label: "Authenticity", value: properties.authenticity },
    { label: "Purchase Date", value: item.purchase_date },
    { label: "Purchase Price", value: item.cost_price ? `$${item.cost_price.toLocaleString()}` : null },
    { label: "Current Value", value: item.current_value ? `$${item.current_value.toLocaleString()}` : null },
    { label: "Purchase Location", value: properties.purchase_location },
    { label: "Insured", value: properties.is_insured ? "Yes" : "No" },
  ].filter(i => i.value);

  const gallery = [item.image_url, ...(item.gallery_urls || [])].filter(Boolean);

  return (
    <div className="pb-24 animate-in fade-in duration-1000">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-12 sticky top-0 z-20 bg-black/80 backdrop-blur-2xl py-4 -mx-6 px-6 md:-mx-16 md:px-16 border-b border-white/5">
        <button onClick={() => router.back()} className="flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        <div className="flex gap-4">
          <Link href={`/card/${id}`} className="hidden sm:flex items-center gap-3 px-6 py-3 border border-white/10 text-[10px] font-black text-white/60 hover:text-white hover:border-white uppercase tracking-[0.3em] transition-all">
            <Share2 className="h-4 w-4" />
            Share Card
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-white/40 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-white p-2">
              <DropdownMenuItem asChild className="focus:bg-white focus:text-black py-3 px-3 cursor-pointer">
                <Link href={`/app/items/${id}/edit`}>
                  <Edit className="mr-3 h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Modify Entry</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-400 focus:bg-red-400 focus:text-white py-3 px-3 cursor-pointer"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-3 h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Expunge Asset</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/5">
                    <Package className="h-24 w-24" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {gallery.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setHeroImage(url)}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-500",
                    heroImage === url ? "border-white scale-95" : "border-white/5 opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
                  )}
                >
                  <Image src={url} alt={`Thumb ${index}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-label-caps text-white/40 uppercase block tracking-[0.4em]">{item.category}</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter italic leading-none">
              {item.name}
            </h1>
            {properties.series_name && (
              <p className="text-xl text-white/20 font-medium tracking-widest">{properties.series_name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1">
            <div className="bg-white text-black p-8 space-y-2">
              <span className="text-label-caps text-black/40 uppercase block tracking-widest">Current Valuation</span>
              <p className="text-4xl font-black italic tracking-tighter">
                ${item.current_value?.toLocaleString() || item.cost_price?.toLocaleString() || "UNSET"}
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-2">
              <span className="text-label-caps text-white/40 uppercase block tracking-widest">Cost Basis</span>
              <p className="text-4xl font-black text-white italic tracking-tighter">
                ${item.cost_price?.toLocaleString() || "UNSET"}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-label-caps text-white uppercase tracking-[0.3em]">Technical Specifications</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              {infoGrid.map((detail, idx) => (
                <div key={idx} className="flex flex-col border-b border-white/5 pb-3 space-y-1">
                  <span className="text-label-caps text-white/40 uppercase tracking-widest">{detail.label}</span>
                  <span className="font-bold text-white tracking-tight">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {item.notes && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-label-caps text-white uppercase tracking-[0.3em]">Curator Notes</span>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>
              <p className="text-white/40 whitespace-pre-wrap bg-white/[0.02] border border-white/10 rounded-2xl p-8 italic text-lg leading-relaxed">
                "{item.notes}"
              </p>
            </div>
          )}
          
          <div className="sm:hidden pt-6">
            <Link 
              href={`/card/${id}`}
              className="flex items-center justify-center gap-4 w-full h-16 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-neutral-200 transition-all"
            >
              <Share2 className="h-4 w-4" />
              Share Provenance Card
            </Link>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border border-white/10 text-white max-w-md">
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-2xl font-bold uppercase tracking-tighter italic">Confirm Expungement</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40 text-sm">
              This will permanently erase <strong className="text-white italic">"{item.name}"</strong> from the archive, including all associated imagery. This is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-8 border-t border-white/5 mt-8">
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5" disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-white text-black hover:bg-neutral-200"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Execute Erase</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

