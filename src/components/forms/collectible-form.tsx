"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Loader2, 
  ChevronDown, 
  ShieldCheck, 
  Image as ImageIcon,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSupabase } from "@/components/providers/supabase-provider";
import { cn } from "@/lib/utils";
import { ImageUploader, MultiImageUploader } from "./image-uploader";
import { 
  CATEGORY_REGISTRY, 
  CategorySlug, 
  CategoryConfig,
  Field as RegistryField,
  Section as RegistrySection
} from "@/registry/category-registry";
import { ManufacturerSelect } from "./manufacturer-select";
import * as LucideIcons from "lucide-react";

// Dynamically build a schema that accepts any key-value pair for properties
// but keeps core fields validated.
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string(),
  purchase_date: z.date().optional(),
  cost_price: z.coerce.number().optional().nullable(),
  current_value: z.coerce.number().optional().nullable(),
  image_url: z.string().optional(),
  gallery_urls: z.array(z.string()).default([]),
  notes: z.string().optional(),
  // All other fields will be handled dynamically in the properties object
}).passthrough(); // Allow any other fields for dynamic form binding

type FormValues = z.infer<typeof formSchema> & Record<string, any>;

interface CollectibleFormProps {
  initialData?: {
    id?: string;
    name?: string;
    category?: string;
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase, session } = useSupabase();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: (initialData ? {
      name: initialData.name ?? "",
      category: initialData.category ?? "statue",
      purchase_date: initialData.purchase_date ? new Date(initialData.purchase_date) : undefined,
      cost_price: initialData.cost_price ?? null,
      current_value: initialData.current_value ?? null,
      image_url: initialData.image_url ?? "",
      gallery_urls: initialData.gallery_urls ?? [],
      notes: initialData?.notes ?? "",
      ...initialData.properties,
    } : {
      name: "",
      category: "statue",
      purchase_date: undefined,
      cost_price: null,
      current_value: null,
      image_url: "",
      gallery_urls: [],
      notes: "",
    }) as any,
  });

  const category = form.watch("category") as CategorySlug;
  const config = CATEGORY_REGISTRY[category];

  useEffect(() => {
    if (config) {
      const initialOpenState: Record<string, boolean> = {};
      config.sections.forEach((_, index) => {
        initialOpenState[`section-${index}`] = true;
      });
      initialOpenState['media'] = true;
      setOpenSections(initialOpenState);
    }
  }, [config]);

  useEffect(() => {
    if (searchParams.get("open") === "true" && config) {
      const allOpen: Record<string, boolean> = {};
      config.sections.forEach((_, index) => {
        allOpen[`section-${index}`] = true;
      });
      allOpen['media'] = true;
      setOpenSections(allOpen);
    }
  }, [searchParams, config]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  async function onSubmit(values: FormValues) {
    if (!session?.user?.id) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    setIsLoading(true);
    
    // Core fields extracted from the flat values object
    const { 
      name, 
      category, 
      purchase_date, 
      cost_price, 
      current_value, 
      notes, 
      image_url, 
      gallery_urls,
      ...rest 
    } = values;

    // Build properties object by checking which fields belong to this category in the registry
    const properties: Record<string, any> = {};
    if (config) {
      config.sections.forEach(section => {
        section.fields.forEach(field => {
          if (rest[field.key] !== undefined) {
            properties[field.key] = rest[field.key];
          }
        });
      });
    }

    const data = {
      user_id: session.user.id,
      name,
      category,
      purchase_date: purchase_date ? format(purchase_date, "yyyy-MM-dd") : null,
      cost_price: cost_price || null,
      current_value: current_value || null,
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {(Object.entries(CATEGORY_REGISTRY) as [CategorySlug, CategoryConfig][]).map(([slug, cat]) => {
            const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
            return (
              <div 
                key={slug}
                className="group cursor-pointer bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded hover:border-white transition-all duration-500 text-center"
                onClick={() => {
                  form.setValue("category", slug);
                  setStep(1);
                }}
              >
                <div className="mb-4 md:mb-6 flex justify-center">
                  <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white/40 group-hover:text-white transition-colors duration-500" />
                </div>
                <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest">{cat.label}</h2>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 pb-32">
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
          {isEdit ? "Modify Asset" : `Add ${config.label}`}
        </h1>
        <p className="text-white/40 text-lg mt-4 max-w-2xl font-medium">
          Securely archive a new masterwork into the vault. Ensure all physical specifications and provenance records are verified for archival integrity.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {config.sections.map((section, sIndex) => (
            <CollapsibleSection
              key={section.title}
              title={section.title}
              icon={<LucideIcons.ShieldCheck className="h-5 w-5" />}
              open={openSections[`section-${sIndex}`]}
              onToggle={() => toggleSection(`section-${sIndex}`)}
              number={String(sIndex + 1).padStart(2, '0')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.fields.map((field) => (
                  <DynamicFormField key={field.key} field={field} control={form.control} category={category} watch={form.watch} />
                ))}
              </div>
            </CollapsibleSection>
          ))}

          <CollapsibleSection
            title="Photos & Media"
            icon={<LucideIcons.Image className="h-5 w-5" />}
            open={openSections.media}
            onToggle={() => toggleSection("media")}
            number={String(config.sections.length + 1).padStart(2, '0')}
          >
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Primary Thumbnail</FormLabel>
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
              <FormField
                control={form.control}
                name="gallery_urls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Archive Gallery</FormLabel>
                    <FormControl>
                      <MultiImageUploader 
                        label="Add supplemental visual records" 
                        value={field.value || []} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleSection>

          <div className="flex flex-col md:flex-row gap-6 pt-12">
            <button 
              type="submit" 
              className="bg-white text-black font-black py-5 px-12 rounded hover:bg-neutral-200 transition-all active:scale-[0.98] uppercase text-sm tracking-[0.2em] flex-1 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
              {isEdit ? "Update Asset" : "Archive to Vault"}
            </button>
            <button 
              type="button" 
              className="border border-white/10 text-white/60 font-black py-5 px-12 rounded hover:bg-white/5 transition-all active:scale-[0.98] uppercase text-sm tracking-[0.2em]"
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

function DynamicFormField({ field, control, category, watch }: { 
  field: RegistryField; 
  control: any; 
  category: string;
  watch: any;
}) {
  const isVisible = !field.dependsOn || !!watch(field.dependsOn);

  if (!isVisible) return null;

  return (
    <FormField
      control={control}
      name={field.key}
      render={({ field: formField }) => (
        <FormItem className={cn(field.type === 'textarea' && "md:col-span-2")}>
          <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">{field.label}</FormLabel>
          <FormControl>
            {(() => {
              switch (field.type) {
                case 'text':
                  return <Input placeholder={field.placeholder} {...formField} value={formField.value || ''} />;
                case 'number':
                  return <Input type="number" placeholder={field.placeholder} {...formField} value={formField.value === null ? '' : formField.value} />;
                case 'textarea':
                  return <Textarea placeholder={field.placeholder} className="min-h-[100px]" {...formField} value={formField.value || ''} />;
                case 'switch':
                  return (
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        checked={formField.value} 
                        onCheckedChange={formField.onChange} 
                      />
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                        {formField.value ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  );
                case 'select':
                  return (
                    <Select onValueChange={formField.onChange} value={formField.value || ''}>
                      <FormControl>
                        <SelectTrigger className="bg-black border-white/10 h-12 text-white">
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/10 text-white">
                        {field.options?.map(opt => (
                          <SelectItem key={opt} value={opt} className="hover:bg-white/10">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case 'date':
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-12 bg-black border-white/10 text-left font-normal text-white",
                              !formField.value && "text-white/20"
                            )}
                          >
                            {formField.value ? format(new Date(formField.value), "PPP") : <span>Select Date</span>}
                            <LucideIcons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
                        <Calendar
                          mode="single"
                          selected={formField.value ? new Date(formField.value) : undefined}
                          onSelect={formField.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  );
                case 'manufacturer':
                  return (
                    <ManufacturerSelect 
                      category={category} 
                      value={formField.value} 
                      onChange={formField.onChange} 
                      placeholder={`Search ${field.label.toLowerCase()}...`}
                    />
                  );
                default:
                  return <Input {...formField} />;
              }
            })()}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
    <div className="glass-vault rounded overflow-hidden transition-all duration-500 mb-6">
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
          <LucideIcons.ChevronDown className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
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

