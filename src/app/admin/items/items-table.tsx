"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  MoreHorizontal, 
  Search, 
  Trash2, 
  Eye, 
  User,
  Package,
  Calendar,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function ItemsTable({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/delete-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: deletingItem.id }),
      });

      if (!response.ok) throw new Error("Failed to delete item");

      setItems(prev => prev.filter(i => i.id !== deletingItem.id));
      toast.success("Item removed from platform");
      setDeletingItem(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <input 
          placeholder="Query asset records..." 
          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl h-14 pl-14 pr-6 text-sm text-white focus:border-white transition-all outline-none placeholder:text-white/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Archival Asset</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Primary Owner</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Classification</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Archive Date</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Moderation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-label-caps text-white/20 uppercase tracking-widest">
                  No assets identified.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill sizes="48px" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-white/10" />
                          </div>
                        )}
                      </div>
                      <span className="font-black text-white uppercase tracking-tight italic group-hover:text-white transition-colors line-clamp-1">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{item.profiles?.full_name || item.profiles?.username}</span>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">{item.profiles?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <span className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {format(new Date(item.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-white p-2">
                        <DropdownMenuLabel className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] px-3 py-2">Moderation Controls</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem className="focus:bg-white focus:text-black py-3 px-3 cursor-pointer" onClick={() => router.push(`/app/items/${item.id}`)}>
                          <Eye className="mr-3 h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Inspect Archive</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:bg-red-400 focus:text-white py-3 px-3 cursor-pointer" onClick={() => setDeletingItem(item)}>
                          <Trash2 className="mr-3 h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Expunge Asset</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent className="bg-black border border-white/10 text-white max-w-md">
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-2xl font-bold uppercase tracking-tighter italic">Expunge Record</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40 text-sm">
              Are you prepared to permanently remove <strong className="text-white italic">{deletingItem?.name}</strong> from the master archive? This operation cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-8 border-t border-white/5 mt-8">
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5" disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem}
              className="bg-white text-black hover:bg-neutral-200"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Execute Erase</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
