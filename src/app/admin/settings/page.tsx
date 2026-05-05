export default function AdminSettingsPage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <header className="space-y-4">
        <span className="text-label-caps text-white/40 block tracking-[0.4em] uppercase">Configuration Terminal</span>
        <h1 className="text-6xl font-bold text-white uppercase tracking-tighter italic">Global Settings</h1>
      </header>
      
      <div className="py-40 border border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
        <p className="text-label-caps text-white/20 uppercase tracking-[0.4em]">Administrative protocols pending initialization</p>
      </div>
    </div>
  );
}
