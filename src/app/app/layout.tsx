import { TopAppBar } from "@/components/layout/top-app-bar";
import { BottomNavBar } from "@/components/layout/bottom-nav-bar";
import { PageTransition } from "@/components/layout/page-transition";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <TopAppBar />
      
      <main className="pt-28 pb-32 px-6 md:px-16 max-w-[1440px] mx-auto min-h-screen">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      <BottomNavBar />
    </div>
  );
}
