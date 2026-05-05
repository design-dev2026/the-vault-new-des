import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CollectibleForm } from "@/components/forms/collectible-form";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("collectibles")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Archival Modification</span>
        <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic">Modify Entry</h1>
      </header>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-1">
        <CollectibleForm initialData={item} isEdit />
      </div>
    </div>
  );
}
