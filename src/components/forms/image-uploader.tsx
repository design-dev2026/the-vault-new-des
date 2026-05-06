"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon, PlusCircle } from "lucide-react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  className?: string;
}

export function ImageUploader({ value, onChange, label, className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { supabase } = useSupabase();

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Unsupported format. Protocol error.`);
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("collectible-images")
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("collectible-images")
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error: any) {
      toast.error(`Ingestion failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [supabase, onChange]);

  return (
    <div className={cn("space-y-4", className)}>
      <label className="text-label-caps text-white/40 uppercase tracking-widest block">{label}</label>
      <div className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border border-white/10 transition-all duration-700 bg-white/[0.02] backdrop-blur-3xl overflow-hidden",
        value ? "h-80" : "h-64 hover:border-white/40 hover:bg-white/[0.05]"
      )}>
        {value ? (
          <div className="relative w-full h-full group">
            <Image src={value} alt="Preview" fill className="object-cover transition-all duration-1000" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                onClick={() => onChange("")}
              >
                Expunge Asset
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-8 space-y-4">
            {isUploading ? (
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            ) : (
              <>
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Initialization Protocol</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">DRAG ASSET OR SELECT MANUALLY</p>
                </div>
              </>
            )}
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleUpload}
              accept="image/*"
              disabled={isUploading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label: string;
  className?: string;
}

export function MultiImageUploader({ value, onChange, label, className }: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { supabase } = useSupabase();

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      if (allowedTypes.includes(files[i].type)) {
        validFiles.push(files[i]);
      }
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [...value];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';

      for (const file of validFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("collectible-images")
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("collectible-images")
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }
      onChange(newUrls);
    } catch (error: any) {
      toast.error(`Multi-ingestion failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [supabase, value, onChange]);

  const removeImage = (index: number) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <label className="text-label-caps text-white/40 uppercase tracking-widest block">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 group">
            <Image src={url} alt={`Preview ${index}`} fill sizes="(max-width: 640px) 50vw, 150px" className="object-cover transition-all duration-700" />
            <button
              type="button"
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-black text-white uppercase tracking-widest"
              onClick={() => removeImage(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="relative aspect-square flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20">
                <PlusCircle className="h-5 w-5" />
              </div>
              <span className="text-[8px] mt-2 text-white/40 font-black uppercase tracking-widest">Add Asset</span>
            </>
          )}
          <input
            type="file"
            multiple
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleUpload}
            accept="image/*"
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
}


