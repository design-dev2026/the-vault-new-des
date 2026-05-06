"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSupabase } from "@/components/providers/supabase-provider";
import { fetchManufacturersByCategory, createManufacturer } from "@/lib/db/manufacturers";
import { toast } from "sonner";

interface ManufacturerSelectProps {
  category: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ManufacturerSelect({ category, value, onChange, placeholder }: ManufacturerSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [manufacturers, setManufacturers] = React.useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchManufacturersByCategory(category);
        setManufacturers(data || []);
      } catch (error) {
        console.error("Failed to load manufacturers:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  const handleCreate = async () => {
    if (!inputValue) return;
    
    try {
      const newMfr = await createManufacturer(inputValue, category);
      setManufacturers(prev => [...prev, newMfr]);
      onChange(newMfr.name);
      setOpen(false);
      setInputValue("");
      toast.success(`Created manufacturer: ${newMfr.name}`);
    } catch (error) {
      toast.error("Failed to create manufacturer");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-black border-[#333] h-12 text-white hover:bg-white/5"
        >
          {value || placeholder || "Select manufacturer..."}
          {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin shrink-0 opacity-50" /> : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-black border-[#333] text-white" align="start" sideOffset={4}>
        <Command className="bg-black text-white">
          <CommandInput 
            placeholder="Search manufacturers..." 
            className="h-12 border-none focus:ring-0" 
            onValueChange={setInputValue}
          />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty className="p-4 flex flex-col gap-4">
              <p className="text-xs text-white/40">No manufacturer found.</p>
              {inputValue && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-dashed border-white/20 hover:border-white h-10 gap-2"
                  onClick={handleCreate}
                >
                  <Plus className="h-3 w-3" />
                  Create "{inputValue}"
                </Button>
              )}
            </CommandEmpty>
            <CommandGroup>
              {manufacturers.map((m) => (
                <CommandItem
                  key={m.id}
                  value={m.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="hover:bg-white/10 cursor-pointer h-10"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === m.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {m.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
