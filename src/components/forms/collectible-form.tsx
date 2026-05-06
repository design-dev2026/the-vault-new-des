"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Maximize2, 
  ShieldCheck, 
  FileText, 
  Landmark, 
  Users,
  Calendar as CalendarIcon,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Car
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/components/providers/supabase-provider";
import { ImageUploader, MultiImageUploader } from "./image-uploader";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["statue", "figure", "hotwheel"]),
  // Basic Info
  artist_name: z.string().optional(),
  manufacturer: z.string().optional(),
  license_holder: z.string().optional(),
  series_name: z.string().optional(),
  edition: z.string().optional(),
  art_style: z.string().optional(),
  pose: z.string().optional(),
  // Physical Details
  scale: z.string().optional(),
  material: z.string().optional(),
  height_cm: z.coerce.number().optional(),
  width_cm: z.coerce.number().optional(),
  depth_cm: z.coerce.number().optional(),
  weight_g: z.coerce.number().optional(),
  sculptor: z.string().optional(),
  // Edition & Rarity
  edition_run: z.coerce.number().int().optional(),
  edition_number: z.coerce.number().int().optional(),
  // Provenance & Value
  purchase_date: z.date().optional(),
  cost_price: z.coerce.number().optional(),
  current_value: z.coerce.number().optional(),
  original_retail_price: z.coerce.number().optional(),
  purchase_location: z.string().optional(),
  purchase_receipt_url: z.string().optional(),
  is_insured: z.boolean().default(false),
  // Condition
  box_condition: z.string().optional(),
  figure_condition: z.string().optional(),
  authenticity: z.string().optional(),
  // Media
  image_url: z.string().optional(),
  gallery_urls: z.array(z.string()).default([]),
  // Notes
  notes: z.string().optional(),
  // Hot Wheels Specific
  model_name: z.string().optional(),
  series: z.string().optional(),
  year: z.coerce.number().nullable().optional(),
  color: z.string().optional(),
  tampo_print: z.string().optional(),
  wheel_type: z.string().optional(),
  condition: z.string().optional(),
  blister_condition: z.string().optional(),
  toy_number: z.string().optional(),
  is_treasure_hunt: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CollectibleFormProps {
  initialData?: {
    id?: string;
    name?: string;
    category?: "statue" | "figure" | "hotwheel";
    purchase_date?: string;
    cost_price?: number;
    current_value?: number;
    notes?: string;
    image_url?: string;
    gallery_urls?: string[];
    properties?: Record<string, any>;
  };
  isEdit?: boolean;
}

export function CollectibleForm({ initialData, isEdit }: CollectibleFormProps) {
  const [step, setStep] = useState(initialData ? 1 : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    physical: true,
    rarity: true,
    value: true,
    condition: true,
    media: true,
    notes: true,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase, session } = useSupabase();
  
  useEffect(() => {
    if (searchParams.get("open") === "true") {
      setOpenSections({
        basic: true,
        physical: true,
        rarity: true,
        value: true,
        condition: true,
        media: true,
        notes: true,
      });
    }
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: (initialData ? {
      name: initialData.name ?? "",
      category: initialData.category ?? "statue",
      artist_name: initialData.properties?.artist_name ?? "",
      manufacturer: initialData.properties?.manufacturer ?? "",
      license_holder: initialData.properties?.license_holder ?? "",
      series_name: initialData.properties?.series_name ?? "",
      edition: initialData.properties?.edition ?? "",
      art_style: initialData.properties?.art_style ?? "",
      pose: initialData.properties?.pose ?? "",
      model_name: initialData.properties?.model_name ?? "",
      series: initialData.properties?.series ?? "",
      year: initialData.properties?.year ?? null,
      color: initialData.properties?.color ?? "",
      tampo_print: initialData.properties?.tampo_print ?? "",
      wheel_type: initialData.properties?.wheel_type ?? "",
      condition: initialData.properties?.condition ?? "Carded Mint",
      blister_condition: initialData.properties?.blister_condition ?? "Unpunched",
      toy_number: initialData.properties?.toy_number ?? "",
      is_treasure_hunt: initialData.properties?.is_treasure_hunt ?? false,
      scale: initialData.properties?.scale ?? "",
      material: initialData.properties?.material ?? "",
      height_cm: initialData.properties?.height_cm ?? null,
      width_cm: initialData.properties?.width_cm ?? null,
      depth_cm: initialData.properties?.depth_cm ?? null,
      weight_g: initialData.properties?.weight_g ?? null,
      sculptor: initialData.properties?.sculptor ?? "",
      edition_run: initialData.properties?.edition_run ?? null,
      edition_number: initialData.properties?.edition_number ?? null,
      purchase_date: initialData.purchase_date ? new Date(initialData.purchase_date) : undefined,
      cost_price: initialData.cost_price ?? null,
      current_value: initialData.current_value ?? null,
      original_retail_price: initialData.properties?.original_retail_price ?? null,
      purchase_location: initialData.properties?.purchase_location ?? "",
      is_insured: initialData.properties?.is_insured ?? false,
      box_condition: initialData.properties?.box_condition ?? "",
      figure_condition: initialData.properties?.figure_condition ?? "",
      authenticity: initialData.properties?.authenticity ?? "",
      image_url: initialData.image_url ?? "",
      gallery_urls: initialData.gallery_urls ?? [],
      notes: initialData?.notes ?? "",
    } : {
      name: "",
      category: "statue" as const,
      artist_name: "",
      manufacturer: "",
      license_holder: "",
      series_name: "",
      edition: "",
      art_style: "",
      pose: "",
      model_name: "",
      series: "",
      year: null,
      color: "",
      tampo_print: "",
      wheel_type: "",
      condition: "Carded Mint",
      blister_condition: "Unpunched",
      toy_number: "",
      is_treasure_hunt: false,
      scale: "",
      material: "",
      height_cm: null,
      width_cm: null,
      depth_cm: null,
      weight_g: null,
      sculptor: "",
      edition_run: null,
      edition_number: null,
      purchase_date: undefined,
      cost_price: null,
      current_value: null,
      original_retail_price: null,
      purchase_location: "",
      is_insured: false,
      box_condition: "",
      figure_condition: "",
      authenticity: "",
      image_url: "",
      gallery_urls: [],
      notes: "",
    }) as any,
  });

  const category = form.watch("category");

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  async function onSubmit(values: FormValues) {
    if (!session?.user?.id) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    setIsLoading(true);
    
    // Separate core fields from properties
    const { 
      name, 
      category, 
      purchase_date, 
      cost_price, 
      current_value, 
      notes, 
      image_url, 
      gallery_urls,
      ...properties 
    } = values;

    const data = {
      user_id: session.user.id,
      name,
      category,
      purchase_date: purchase_date ? format(purchase_date, "yyyy-MM-dd") : null,
      cost_price,
      current_value,
      notes,
      image_url,
      gallery_urls,
      properties,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEdit && initialData?.id) {
        const { error } = await supabase
          .from("collectibles")
          .update(data)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("Collectible updated successfully!");
      } else {
        const { data: inserted, error } = await supabase
          .from("collectibles")
          .insert([data])
          .select()
          .single();
        if (error) throw error;
        toast.success("Collectible added to your vault!");
        router.push(`/app/items/${inserted.id}`);
        return;
      }
      router.push(`/app/items/${initialData?.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (step === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <span className="text-label-caps text-white/40">VAULT MANAGEMENT</span>
          <h1 className="text-5xl font-bold text-white uppercase tracking-tighter">SELECT CATEGORY</h1>
          <p className="text-white/40 text-lg">Choose the archival framework for your new asset.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: "statue", name: "STATUE", icon: Landmark, desc: "Polystone & Resin masterworks." },
            { id: "figure", name: "FIGURE", icon: Users, desc: "Articulated action masterpieces." },
            { id: "hotwheel", name: "HOT WHEELS", icon: Car, desc: "Die-cast engineering marvels." }
          ].map((cat) => (
            <div 
              key={cat.id}
              className="group cursor-pointer bg-[#0A0A0A] border border-[#1A1A1A] p-10 rounded-lg hover:border-white transition-all duration-500 text-center"
              onClick={() => {
                form.setValue("category", cat.id as any);
                setStep(1);
              }}
            >
              <div className="mb-8 flex justify-center">
                <cat.icon className="h-12 w-12 text-white/40 group-hover:text-white transition-colors duration-500" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">{cat.name}</h2>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="mb-12">
        <div className="flex justify-between items-start">
          <span className="text-label-caps text-white/40 mb-2 block uppercase">ENTRY MANAGEMENT</span>
          {!isEdit && (
            <button 
              onClick={() => setStep(0)} 
              className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
            >
              CHANGE CATEGORY
            </button>
          )}
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter italic">
          {isEdit ? "Modify Asset" : `Add ${form.getValues("category")}`}
        </h1>
        <p className="text-white/40 text-lg mt-4 max-w-2xl font-medium">
          Securely archive a new masterwork into the vault. Ensure all physical specifications and provenance records are verified for archival integrity.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CollapsibleSection
            title="Basic Information"
            icon={<Info className="h-5 w-5" />}
            open={openSections.basic}
            onToggle={() => toggleSection("basic")}
            number="01"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Item Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. The Mourning Apollo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Manufacturer / Studio</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sideshow Collectibles" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artist_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Lead Artist</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. XM Studios" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {category === 'hotwheel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/5">
                <FormField
                  control={form.control}
                  name="model_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Model Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Custom '69 Chevy Pickup" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="series"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Hot Wheels Series</FormLabel>
                      <FormControl><Input placeholder="e.g. HW Hot Trucks" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Physical Details"
            icon={<Maximize2 className="h-5 w-5" />}
            open={openSections.physical}
            onToggle={() => toggleSection("physical")}
            number="02"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Material</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black border-[#333] h-12 text-white">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-[#333] text-white">
                        {["Polystone", "Resin", "PVC", "ABS", "Cold Cast", "Vinyl", "Other"].map(m => (
                          <SelectItem key={m} value={m.toLowerCase()} className="hover:bg-white/10">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height_cm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Height (cm)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight_g"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Weight (g)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-12 space-y-4">
              <label className="text-label-caps text-white/40 uppercase tracking-widest">Primary Visual Asset</label>
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader 
                        label="Drop high-resolution scan or browse files" 
                        value={field.value || ""} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Provenance & Value"
            icon={<CalendarIcon className="h-5 w-5" />}
            open={openSections.value}
            onToggle={() => toggleSection("value")}
            number="03"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Acquisition Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-12 bg-black border-[#333] text-left font-normal text-white",
                              !field.value && "text-white/20"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Select Date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black border-[#333]" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Acquisition Value (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Condition"
            icon={<CheckCircle2 className="h-5 w-5" />}
            open={openSections.condition}
            onToggle={() => toggleSection("condition")}
            number="04"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="box_condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Box Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Mint", "Good (C9)", "Fair (C8)", "Worn", "No Box"].map(c => (
                          <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="figure_condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Figure Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Mint", "Like New", "Displayed", "Damaged", "Repaired"].map(c => (
                          <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {category === 'hotwheel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-dashed">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Overall Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Carded Mint", "Carded Near Mint", "Loose Mint", "Loose Worn"].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blister_condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Blister / Card Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select blister condition" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Unpunched", "Punched", "None (Loose)"].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Photos & Media"
            icon={<ImageIcon className="h-5 w-5" />}
            open={openSections.media}
            onToggle={() => toggleSection("media")}
            number="05"
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader 
                        label="Primary Thumbnail Image" 
                        value={field.value || ""} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gallery_urls"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiImageUploader 
                        label="Gallery Images" 
                        value={field.value || []} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Notes"
            icon={<FileText className="h-5 w-5" />}
            open={openSections.notes}
            onToggle={() => toggleSection("notes")}
            number="06"
          >
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any extra details, history, or damage reports..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CollapsibleSection>

          <div className="flex flex-col md:flex-row gap-6 pt-12">
            <button 
              type="submit" 
              className="bg-white text-black font-black py-5 px-12 rounded-lg hover:bg-neutral-200 transition-all active:scale-[0.98] uppercase text-sm tracking-[0.2em] flex-1 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
              {isEdit ? "Update Asset" : "Archive to Vault"}
            </button>
            <button 
              type="button" 
              className="border border-white text-white font-black py-5 px-12 rounded-lg hover:bg-white/10 transition-all active:scale-[0.98] uppercase text-sm tracking-[0.2em]"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel Entry
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function CollapsibleSection({ title, icon, children, open, onToggle, number }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  number: string;
}) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-[#333] rounded-lg overflow-hidden transition-all duration-500 mb-6">
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center px-8 py-6 text-left hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-6">
          <span className="text-label-caps text-white/20">{number}</span>
          <span className="text-xl font-bold text-white uppercase tracking-tight group-hover:tracking-wider transition-all duration-500">
            {title}
          </span>
        </div>
        <div className={cn("transition-transform duration-500", open ? "rotate-180" : "rotate-0")}>
          <ChevronDown className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
        </div>
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-8 pb-10 border-t border-white/5 pt-10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
