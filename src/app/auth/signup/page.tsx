"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { User, Mail, Lock, Loader2, AtSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/components/providers/supabase-provider";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don&apos;t match",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          username: values.username,
        },
        emailRedirectTo: `${window.location.origin}/auth/signin`,
      },
    });

    if (error) {
      toast.error("Error creating account", {
        description: error.message,
      });
      setIsLoading(false);
    } else {
      toast.success("Account created!", {
        description: "Please check your email to confirm your account.",
      });
      await new Promise(r => setTimeout(r, 1000));
      router.push("/auth/signin");
    }
  }

  async function onGoogleSignUp() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      toast.error("Error with Google sign-up", {
        description: error.message,
      });
    } else if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)] overflow-hidden px-6 py-12">
      {/* Ambient light accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[480px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-white/10 rounded-xl mb-4 group hover:border-white/40 transition-all duration-700">
            <User className="h-8 w-8 text-white font-thin" />
          </div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-tighter italic">CREATE MASTER ACCOUNT</h1>
          <p className="text-label-caps text-white/40 tracking-[0.3em] uppercase">Initialize your secure archive</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-10 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          className="bg-black/50 border-white/10 h-12 text-white focus:border-white transition-all duration-500 rounded-xl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Alias</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="johndoe" 
                          className="bg-black/50 border-white/10 h-12 text-white focus:border-white transition-all duration-500 rounded-xl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Master Identity</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="identity@vault.com" 
                        className="bg-black/50 border-white/10 h-12 text-white focus:border-white transition-all duration-500 rounded-xl" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Secret Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-black/50 border-white/10 h-12 text-white focus:border-white transition-all duration-500 rounded-xl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-label-caps text-white/40 uppercase tracking-widest">Verify Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-black/50 border-white/10 h-12 text-white focus:border-white transition-all duration-500 rounded-xl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-white text-black h-14 font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center justify-center" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Initialize Account"}
              </button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.4em]">
              <span className="bg-[#0c0c0c] px-4 text-white/20">Alternative Protocol</span>
            </div>
          </div>

          <button 
            onClick={onGoogleSignUp}
            className="w-full h-14 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Initialize with Google
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 text-[10px] tracking-widest uppercase font-bold text-white/40">
          <Link href="/auth/signin" className="hover:text-white transition-colors underline underline-offset-8">
            Already have an account? Sign In
          </Link>
        </div>
      </div>

      {/* Security Footer Accent */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20">
        <div className="h-[1px] w-12 bg-white"></div>
        <span className="text-[8px] tracking-[1em] text-white uppercase">ENCRYPTED END-TO-END</span>
        <div className="h-[1px] w-12 bg-white"></div>
      </div>
    </div>
  );
}
