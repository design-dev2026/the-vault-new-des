"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/components/providers/supabase-provider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { supabase } = useSupabase();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setIsLoading(false);
    if (error) {
      toast.error("Error sending reset link", {
        description: error.message,
      });
    } else {
      setIsSent(true);
      toast.success("Reset link sent!", {
        description: "Please check your email for the password reset link.",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] overflow-hidden px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-white/10 rounded-xl mb-4">
            <Mail className="h-8 w-8 text-white font-thin" />
          </div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-tighter italic">Identity Recovery</h1>
          <p className="text-label-caps text-white/40 tracking-[0.3em] uppercase">
            {isSent ? "Recovery protocol transmitted" : "Provide your identity for credential reset"}
          </p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-10 space-y-8">
          {!isSent ? (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-label-caps text-white/40 uppercase tracking-widest">Master Identity</label>
                <input 
                  type="email" 
                  placeholder="identity@vault.com" 
                  className="w-full bg-black/50 border border-white/10 h-14 px-4 text-white focus:border-white transition-all duration-500 rounded-xl outline-none placeholder:text-white/10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-white text-black h-14 font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center justify-center" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Transmit Recovery Protocol"}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-8">
              <p className="text-white/40 text-sm leading-relaxed">
                If an account exists for <strong className="text-white italic">{email}</strong>, recovery instructions have been transmitted.
              </p>
              <Link 
                href="/auth/signin"
                className="block w-full h-14 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.3em] rounded-xl hover:bg-white/5 transition-all flex items-center justify-center"
              >
                Return to Vault Access
              </Link>
            </div>
          )}
        </div>

        {!isSent && (
          <div className="flex flex-col items-center">
            <Link href="/auth/signin" className="group flex items-center gap-3 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-all">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Back to Vault Access
            </Link>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20">
        <div className="h-[1px] w-12 bg-white"></div>
        <span className="text-[8px] tracking-[1em] text-white uppercase">IDENTITY VERIFICATION</span>
        <div className="h-[1px] w-12 bg-white"></div>
      </div>
    </div>
  );
}
