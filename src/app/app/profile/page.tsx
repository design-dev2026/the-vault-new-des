"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail, Calendar, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  if (!session) return null;

  const user = session.user;
  const metadata = user.user_metadata;

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
      {/* Identity Header */}
      <div className="flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-16">
        <div className="relative group">
          <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white transition-all duration-1000 bg-white/5">
            {metadata?.avatar_url ? (
              <img 
                src={metadata.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover grayscale"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-16 w-16 text-white/5" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black tracking-[0.3em] px-4 py-1 rounded-full uppercase">
            Verified
          </div>
        </div>

        <div className="text-center md:text-left space-y-6">
          <div className="space-y-1">
            <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Master Identity</span>
            <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic leading-none">
              {metadata?.full_name || "Anonymous Archivist"}
            </h1>
            <p className="text-xl text-white/20 font-medium tracking-widest">@{metadata?.username || "vault_entry"}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="px-4 py-1 border border-white/10 rounded-full text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Level: {metadata?.role || "Grand Collector"}
            </span>
            <span className="px-4 py-1 border border-white/10 rounded-full text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Assets: 128
            </span>
          </div>
        </div>
      </div>

      {/* Identity Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-label-caps text-white uppercase tracking-[0.3em]">Credentials</span>
            <div className="flex-1 h-[1px] bg-white/5"></div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6 rounded-2xl">
            <div className="space-y-2">
              <span className="text-label-caps text-white/40 uppercase block tracking-widest">Communication Protocol</span>
              <p className="text-lg font-bold text-white tracking-tight">{user.email}</p>
            </div>
            <div className="space-y-2 pt-6 border-t border-white/5">
              <span className="text-label-caps text-white/40 uppercase block tracking-widest">Initialization Date</span>
              <p className="text-lg font-bold text-white tracking-tight">
                {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-label-caps text-white uppercase tracking-[0.3em]">Security</span>
            <div className="flex-1 h-[1px] bg-white/5"></div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6 rounded-2xl flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Two-Factor Auth</span>
                <span className="text-[8px] font-black text-white px-2 py-1 bg-white/10 rounded">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Encryption Tier</span>
                <span className="text-[8px] font-black text-white px-2 py-1 bg-white/10 rounded">Military Grade</span>
              </div>
            </div>

            <button 
              className="w-full h-14 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-4 group"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              Terminate Session
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
