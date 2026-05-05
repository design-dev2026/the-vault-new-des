import { serviceClient } from "@/lib/supabase/service";
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ItemCard } from "@/components/collectors/item-card";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminUserCollectionPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const supabase = serviceClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) notFound();

  const { data: items } = await supabase
    .from("collectibles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/users" className="group flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Link>
        </div>
      </div>

      <header className="space-y-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <User className="h-5 w-5 text-white/20" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Read-Only Inspection</span>
        </div>
        <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic">
          {profile.full_name || profile.username}
        </h1>
      </header>

      {items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 text-center space-y-4">
          <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center text-white/5">
            <User className="h-12 w-12" />
          </div>
          <p className="text-label-caps text-white/20 uppercase tracking-[0.4em]">Empty archive — no assets registered</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {items?.map((item: any) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
