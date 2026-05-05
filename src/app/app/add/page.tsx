import { CollectibleForm } from "@/components/forms/collectible-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function AddItemPage() {
  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Asset Registration</span>
        <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic">New Entry</h1>
      </header>
      
      <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>}>
        <CollectibleForm />
      </Suspense>
    </div>
  );
}
