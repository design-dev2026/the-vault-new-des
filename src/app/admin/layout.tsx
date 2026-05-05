import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PageTransition } from "@/components/layout/page-transition";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;

    if (user) {
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = userProfile;
    }
  } catch (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-black">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tighter italic">Configuration Error</h1>
          <p className="text-white/40 text-sm">The application environment is not correctly configured. Please check your Supabase variables.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/auth/signin");
  }

  if (profile?.role !== "admin") {
    redirect("/app");
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-shrink-0">
        <AdminSidebar />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top bar */}
        <header className="h-20 border-b border-white/5 bg-black/90 backdrop-blur-2xl flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-3 md:hidden">
            <Shield className="h-5 w-5 text-white" />
            <span className="text-lg font-black tracking-tighter italic text-white uppercase">VAULT</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{profile.full_name || "Admin"}</p>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mt-1">System Overseer</p>
            </div>
            <div className="h-10 w-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover grayscale" />
              ) : (
                <AvatarFallback className="bg-white/10 text-white/40 font-black">{profile.username?.charAt(0).toUpperCase() || "A"}</AvatarFallback>
              )}
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </main>

      {/* Mobile Nav could be added here if needed, but for now we focus on Desktop Admin */}
    </div>
  );
}
