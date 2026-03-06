
"use client";

import { useState } from "react";
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  createAuthAccountSecondary, 
  useAuth,
  useUser,
  errorEmitter,
  FirestorePermissionError
} from "@/firebase";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Shield, Loader2, Search, Lock, Mail, User, KeyRound, AlertTriangle } from "lucide-react";
import { Role, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UserManagement() {
  const db = useFirestore();
  const auth = useAuth();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  
  // Creation state
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: 'SURVEYOR' as Role });

  // Reset Password state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<UserProfile | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "users");
  }, [db]);
  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const handleAddUser = async () => {
    if (!db || !newUser.email || !newUser.name || !newUser.password) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    
    setIsAdding(true);
    try {
      const uid = await createAuthAccountSecondary(newUser.email, newUser.password);
      
      await setDoc(doc(db, "users", uid), {
        id: uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      });

      toast({ 
        title: "User Created Successfully", 
        description: `Account created for ${newUser.name}.` 
      });
      setNewUser({ name: "", email: "", password: "", role: 'SURVEYOR' });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({ 
          title: "Account Already Exists", 
          description: "This email is already in use. You cannot create a new account with it.", 
          variant: "destructive" 
        });
      } else {
        toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!auth || !userToReset) return;
    
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, userToReset.email);
      toast({ 
        title: "Reset Link Sent", 
        description: `A password reset instructions have been sent to ${userToReset.email}.` 
      });
      setResetDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Request Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsResetting(false);
      setUserToReset(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!db || !userToDelete) return;
    
    setIsDeleting(true);
    const userDocRef = doc(db, "users", userToDelete.id);
    try {
      await deleteDoc(userDocRef);
      toast({ title: "Access Revoked", description: "The user profile has been successfully deleted." });
      setDeleteDialogOpen(false);
    } catch (serverError: any) {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const triggerReset = (user: UserProfile) => {
    setUserToReset(user);
    setResetDialogOpen(true);
  };

  const triggerDelete = (user: UserProfile) => {
    if (user.id === currentUser?.uid) {
      toast({ title: "Action Restricted", description: "You cannot remove your own administrative access.", variant: "destructive" });
      return;
    }
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Identity & Role Management</h1>
          <p className="text-slate-500 text-sm mt-1">Authorize system users and manage role permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-sm h-fit rounded-3xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="John Doe" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="email" placeholder="name@trsgroup.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Set Initial Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="password" placeholder="Min 6 characters" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">System Role</Label>
              <Select value={newUser.role} onValueChange={(val: Role) => setNewUser({...newUser, role: val})}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SURVEYOR">Field Surveyor</SelectItem>
                  <SelectItem value="VIEWER">Report Viewer</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddUser} disabled={isAdding} className="w-full h-12 rounded-xl font-bold bg-primary mt-4 shadow-lg shadow-primary/20">
              {isAdding ? <Loader2 className="animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Initialize Account
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
            <CardTitle className="text-lg font-bold">Authorized Personnel</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Filter team..." className="pl-9 h-9 text-xs rounded-lg border-slate-100" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-50 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 pl-6 py-4">Name</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4">Role</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4">Email</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(u => (
                    <TableRow key={u.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                      <TableCell className="font-bold text-slate-900 pl-6">{u.name}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "uppercase text-[9px] font-black tracking-widest px-2 py-0.5",
                          u.role === 'ADMIN' ? 'bg-primary text-white' : 
                          u.role === 'SURVEYOR' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                        )}>{u.role}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{u.email}</TableCell>
                      <TableCell className="text-right pr-6 space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-primary transition-colors" 
                          onClick={() => triggerReset(u)}
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "h-8 w-8 transition-colors",
                            u.id === currentUser?.uid ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-red-500"
                          )}
                          onClick={() => triggerDelete(u)}
                          title={u.id === currentUser?.uid ? "Cannot delete yourself" : "Delete User"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!users || users.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-slate-400 uppercase text-[10px] font-bold tracking-widest">No users authorized</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reset Password Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="rounded-3xl border-none">
          <DialogHeader>
            <DialogTitle className="font-headline font-bold text-xl flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              This will send a secure password reset link to <strong>{userToReset?.email}</strong>. The user will be able to set their own new password safely.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setResetDialogOpen(false)} className="rounded-xl h-12 font-bold">Cancel</Button>
            <Button 
              onClick={handleConfirmReset} 
              disabled={isResetting}
              className="bg-primary rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/10"
            >
              {isResetting ? <Loader2 className="animate-spin mr-2" /> : <Mail className="mr-2 w-4 h-4" />}
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Revoke System Access?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              Are you sure you want to permanently delete the account for <strong>{userToDelete?.name}</strong>? 
              This action cannot be undone and they will immediately lose access to the portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl h-12 font-bold border-slate-100">Cancel</AlertDialogCancel>
            <Button 
              onClick={handleConfirmDelete} 
              disabled={isDeleting}
              variant="destructive"
              className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-rose-100"
            >
              {isDeleting ? <Loader2 className="animate-spin mr-2" /> : <Trash2 className="mr-2 w-4 h-4" />}
              Confirm Deletion
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
