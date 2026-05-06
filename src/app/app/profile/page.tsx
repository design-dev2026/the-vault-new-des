"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail, Calendar, Shield, Edit3, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [assetCount, setAssetCount] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.user_metadata?.full_name || "");
      setUsername(session.user.user_metadata?.username || "");
      fetchAssetCount();
    }
  }, [session]);

  async function fetchAssetCount() {
    if (!session?.user?.id) return;
    const { count, error } = await supabase
      .from("collectibles")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id);
    
    if (!error) setAssetCount(count);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          username: username
        }
      });

      if (error) throw error;
      
      toast.success("Identity Updated", {
        description: "Your master credentials have been synchronized."
      });
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error("Protocol Error", {
        description: error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session) return null;

  const user = session.user;
  const metadata = user.user_metadata;

  // Level Logic
  const getLevel = (count: number) => {
    if (count >= 100) return "Grand Collector";
    if (count >= 50) return "Master Archivist";
    if (count >= 20) return "Senior Curator";
    if (count >= 10) return "Elite Collector";
    return "Initiate";
  };

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

        <div className="text-center md:text-left flex-1 space-y-6">
          <div className="space-y-1 relative group/title">
            <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Master Identity</span>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic leading-none">
                {metadata?.full_name || "Anonymous Archivist"}
              </h1>
              
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-full border border-white/10 text-white/20 hover:text-white hover:border-white transition-all opacity-0 group-hover/title:opacity-100">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black border border-white/10 text-white max-w-md">
                  <DialogHeader className="space-y-4">
                    <DialogTitle className="text-h2 uppercase tracking-tighter italic font-black">Edit Identity</DialogTitle>
                    <DialogDescription className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                      Update your archival credentials in the master ledger.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-8 py-8">
                    <div className="space-y-3">
                      <Label htmlFor="full_name" className="text-label-caps text-white/40 tracking-[0.2em]">Full Legal Name</Label>
                      <Input 
                        id="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-white/5 border-white/10 rounded-xl h-12 focus:border-white transition-all text-white placeholder:text-white/10"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-label-caps text-white/40 tracking-[0.2em]">Archival Alias (Username)</Label>
                      <Input 
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/5 border-white/10 rounded-xl h-12 focus:border-white transition-all text-white placeholder:text-white/10"
                        placeholder="e.g. vault_master_01"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      className="w-full h-12 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200"
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Synchronization"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xl text-white/20 font-medium tracking-widest">@{metadata?.username || "vault_entry"}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="px-6 py-2 border border-white/10 rounded-full flex items-center gap-3 bg-white/[0.02]">
              <Shield className="h-3 w-3 text-white/40" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Level: {getLevel(assetCount || 0)}
              </span>
            </div>
            <div className="px-6 py-2 border border-white/10 rounded-full flex items-center gap-3 bg-white/[0.02]">
              <Calendar className="h-3 w-3 text-white/40" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Assets: {assetCount !== null ? assetCount : "..."}
              </span>
            </div>
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
