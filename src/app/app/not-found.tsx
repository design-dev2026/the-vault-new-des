import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function AppNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-in fade-in duration-1000">
      <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center">
        <FileQuestion className="h-16 w-16 text-white/5" />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white uppercase tracking-tighter italic">Archive Entry Missing</h2>
        <p className="text-label-caps text-white/20 uppercase tracking-[0.3em] max-w-xs mx-auto">
          This asset does not exist or has been permanently expunged from the vault.
        </p>
      </div>
      <Link 
        href="/app" 
        className="text-[10px] font-black text-white uppercase tracking-[0.3em] border-b border-white pb-1 hover:text-white/60 hover:border-white/60 transition-all"
      >
        Return to Archive
      </Link>
    </div>
  );
}
