"use client";

import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function MagicLinkPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] overflow-hidden px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-white/10 rounded-full">
            <Mail className="h-10 w-10 text-white animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-tighter italic">Signal Transmitted</h1>
          <p className="text-label-caps text-white/40 tracking-[0.3em] uppercase">
            A secure access link has been dispatched to your identity
          </p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-10 space-y-8">
          <p className="text-white/40 text-sm leading-relaxed">
            Check your inbox and spam folder. Click the encrypted link to gain immediate access.
          </p>
          <button className="w-full h-14 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.3em] rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-3">
            <Send className="h-4 w-4" />
            Retransmit Protocol
          </button>
        </div>

        <Link href="/auth/signin" className="group inline-flex items-center gap-3 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-all">
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Return to Vault Access
        </Link>
      </div>
    </div>
  );
}
