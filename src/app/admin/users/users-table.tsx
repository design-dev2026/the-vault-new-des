"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MoreHorizontal, 
  Search, 
  Trash2, 
  UserCircle, 
  ExternalLink,
  Shield,
  ShieldAlert,
  Loader2,
  Package
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function UsersTable({ users: initialUsers }: { users: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deletingUser.id }),
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      toast.success("User and all data deleted permanently");
      setDeletingUser(null);
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
          placeholder="Query collector identities..." 
          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl h-14 pl-14 pr-6 text-sm text-white focus:border-white transition-all outline-none placeholder:text-white/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Collector Identity</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Archival Start</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Asset Count</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Access Level</TableHead>
              <TableHead className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Operations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-label-caps text-white/20 uppercase tracking-widest">
                  No records identified.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover grayscale" />
                        ) : (
                          <UserCircle className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white uppercase tracking-tight italic group-hover:text-white transition-colors">
                          {user.full_name || user.username}
                        </span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {format(new Date(user.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Package className="h-3 w-3 text-white/20" />
                      <span className="text-xs font-black text-white italic tracking-tighter">{user.total_items}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <Select 
                      defaultValue={user.role} 
                      onValueChange={(val) => handleUpdateRole(user.id, val)}
                    >
                      <SelectTrigger className={cn(
                        "h-10 w-[120px] bg-transparent border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/60",
                        user.role === "admin" ? "bg-white text-black border-white" : ""
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10 text-white">
                        <SelectItem value="user">Collector</SelectItem>
                        <SelectItem value="admin">Overseer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-white p-2">
                        <DropdownMenuLabel className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] px-3 py-2">Master Controls</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem className="focus:bg-white focus:text-black py-3 px-3 cursor-pointer" onClick={() => router.push(`/admin/users/${user.id}/collection`)}>
                          <ExternalLink className="mr-3 h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Access Collection</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:bg-red-400 focus:text-white py-3 px-3 cursor-pointer" onClick={() => setDeletingUser(user)}>
                          <Trash2 className="mr-3 h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Terminate Account</span>
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

      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent className="bg-black border border-white/10 text-white max-w-md">
          <AlertDialogHeader className="space-y-4">
            <AlertDialogTitle className="text-2xl font-bold uppercase tracking-tighter italic">Confirm Termination</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40 text-sm">
              Are you prepared to permanently erase the archive for <strong className="text-white italic">{deletingUser?.email}</strong>? This operation is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-8 border-t border-white/5 mt-8">
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5" disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
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

import { cn } from "@/lib/utils";
