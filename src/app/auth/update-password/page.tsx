"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/components/providers/supabase-provider";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords mismatch", {
        description: "Please make sure both passwords are the same.",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);
    if (error) {
      toast.error("Error updating password", {
        description: error.message,
      });
    } else {
      setIsSuccess(true);
      toast.success("Password updated!", {
        description: "Your password has been changed successfully.",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] overflow-hidden px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-white/10 rounded-xl mb-4">
            <Lock className="h-8 w-8 text-white font-thin" />
          </div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-tighter italic">New Credentials</h1>
          <p className="text-label-caps text-white/40 tracking-[0.3em] uppercase">
            Establish a new secret key for vault access
          </p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-10 space-y-8">
          {!isSuccess ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-label-caps text-white/40 uppercase tracking-widest">New Secret Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="w-full bg-black/50 border border-white/10 h-14 px-4 text-white focus:border-white transition-all duration-500 rounded-xl outline-none placeholder:text-white/10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-label-caps text-white/40 uppercase tracking-widest">Verify Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="w-full bg-black/50 border border-white/10 h-14 px-4 text-white focus:border-white transition-all duration-500 rounded-xl outline-none placeholder:text-white/10" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-white text-black h-14 font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center justify-center" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Finalize Credential Reset"}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 border border-white/10 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-white uppercase tracking-tighter italic">
                  Credentials Updated
                </p>
                <p className="text-label-caps text-white/40 uppercase tracking-[0.3em]">
                  Redirecting to your vault...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20">
        <div className="h-[1px] w-12 bg-white"></div>
        <span className="text-[8px] tracking-[1em] text-white uppercase">SECURE CREDENTIAL RESET</span>
        <div className="h-[1px] w-12 bg-white"></div>
      </div>
    </div>
  );
}
