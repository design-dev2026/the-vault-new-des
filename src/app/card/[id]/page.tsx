import { notFound } from "next/navigation";
import { serviceClient } from "@/lib/supabase/service";
export const dynamic = "force-dynamic";

import { ShareableCard } from "@/components/collectors/shareable-card";

interface CardPageProps {
  params: Promise<{ id: string }>;
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params;
  const supabase = serviceClient();

  const { data: item, error } = await supabase
    .from("collectibles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black py-16 px-6 md:py-24">
      <ShareableCard item={item} />
    </div>
  );
}
