
"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Shield, Loader2, Search, UserCheck } from "lucide-react";
import { Role, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

export function UserManagement() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ uid: "", name: "", email: "", role: 'VIEWER' as Role });

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "users");
  }, [db]);
  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const handleAddUser = async () => {
    if (!db || !newUser.uid || !newUser.email || !newUser.name) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    setIsAdding(true);
    try {
      await setDoc(doc(db, "users", newUser.uid), {
        id: newUser.uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      });
      toast({ title: "User Authorized Successfully" });
      setNewUser({ uid: "", name: "", email: "", role: 'VIEWER' });
    } catch (error: any) {
      toast({ title: "Authorization Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Revoke all access for this user?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      toast({ title: "User Access Revoked" });
    } catch (error: any) {
      toast({ title: "Revoke Failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Identity & Role Management</h1>
          <p className="text-slate-500 text-sm mt-1">Authorize system access and manage role permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Authorization Form */}
        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Authorize New User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-slate-400">Firebase UID</Label>
              <Input placeholder="User unique ID" value={newUser.uid} onChange={e => setNewUser({...newUser, uid: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-slate-400">Full Name</Label>
              <Input placeholder="John Doe" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-slate-400">Work Email</Label>
              <Input placeholder="name@trsgroup.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold text-slate-400">System Role</Label>
              <Select value={newUser.role} onValueChange={(val: Role) => setNewUser({...newUser, role: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SURVEYOR">Field Surveyor</SelectItem>
                  <SelectItem value="VIEWER">Report Viewer</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddUser} disabled={isAdding} className="w-full h-11 rounded-xl font-bold bg-primary mt-2">
              {isAdding ? <Loader2 className="animate-spin" /> : "Authorize User"}
            </Button>
          </CardContent>
        </Card>

        {/* User List */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Authorized Personnel</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Filter users..." className="pl-9 h-9 text-xs" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 pl-6">Name</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400">Role</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400">Email</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(u => (
                    <TableRow key={u.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-900 pl-6">{u.name}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "uppercase text-[9px] font-black tracking-widest",
                          u.role === 'ADMIN' ? 'bg-indigo-500' : 
                          u.role === 'SURVEYOR' ? 'bg-emerald-500' : 'bg-slate-500'
                        )}>{u.role}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{u.email}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
