"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useSupabase } from "@/components/providers/supabase-provider";

export default function RootPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.push("/app");
    }
  }, [session, loading, router]);

  if (loading || session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] overflow-hidden px-6 md:px-16">
      {/* Ambient Light Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Center Brand Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[600px]">
        {/* Minimalist Vault Icon */}
        <div className="mb-12 group">
          <div className="relative w-24 h-24 flex items-center justify-center border border-white/10 rounded-xl transition-all duration-700 group-hover:border-white/40">
            <Lock className="h-12 w-12 text-white font-thin" />
            {/* Decorative corner accents */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-white/40"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-white/40"></div>
          </div>
        </div>

        {/* Typography Header */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tight font-sans">
            VAULT
          </h1>
          <p className="text-label-caps tracking-[0.4em] text-white/60 uppercase">
            Your Collection, Mastered.
          </p>
        </div>

        {/* CTA Cluster */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 w-full max-w-sm">
          <Link 
            href="/auth/signup"
            className="flex-1 px-8 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all duration-300 text-center"
          >
            Create Account
          </Link>
          <Link 
            href="/auth/signin"
            className="flex-1 px-8 py-5 bg-transparent border border-white text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all duration-300 text-center"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Decorative Asset Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none grid grid-cols-2 md:grid-cols-4 gap-8 p-12 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={cn(
              "h-[400px] border border-white/5 rounded-lg overflow-hidden bg-white/5",
              i % 2 === 0 ? "-translate-y-24" : "translate-y-12"
            )}
          />
        ))}
      </div>

      {/* Floating Glass Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white/5 backdrop-blur-3xl border-t border-white/10 pointer-events-none flex items-center justify-center opacity-40">
        <div className="max-w-[1440px] w-full flex justify-between items-center px-16 opacity-20">
          <span className="text-label-caps text-[10px] tracking-[0.6em] text-white">SECURE ENCLAVE 4.0</span>
          <span className="text-label-caps text-[10px] tracking-[0.6em] text-white">ESTABLISHED MMXXIV</span>
        </div>
      </div>
    </main>
  );
}

import { cn } from "@/lib/utils";
