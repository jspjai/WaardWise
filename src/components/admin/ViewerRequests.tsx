
"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, createAuthAccountSecondary } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Mail, Trash2, UserPlus, Clock } from "lucide-react";
import { ViewerRequest } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ViewerRequests() {
  const db = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const requestsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "viewer_requests");
  }, [db]);
  const { data: requests, isLoading } = useCollection<ViewerRequest>(requestsQuery);

  const handleApproveAndCreate = async (req: ViewerRequest) => {
    if (!db || !req.email || !req.password) {
      toast({ title: "Cannot Approve", description: "Request is missing email or password data.", variant: "destructive" });
      return;
    }

    setProcessingId(req.id);
    try {
      // 1. Create Auth Account using stored password
      const uid = await createAuthAccountSecondary(req.email, req.password);
      
      // 2. Create User Profile
      await setDoc(doc(db, "users", uid), {
        id: uid,
        name: req.name,
        email: req.email,
        role: "VIEWER",
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      });

      // 3. Mark Request as Approved
      await updateDoc(doc(db, "viewer_requests", req.id), { status: 'APPROVED' });
      
      toast({ title: "Account Created", description: `Viewer account for ${req.name} is now active.` });
    } catch (error: any) {
      toast({ title: "Approval Failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "viewer_requests", id), { status: 'REJECTED' });
      toast({ title: "Request Rejected" });
    } catch (error) {
      toast({ title: "Reject Failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request history?")) return;
    try {
      await deleteDoc(doc(db, "viewer_requests", id));
      toast({ title: "Request Deleted" });
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Access Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Review and authorize prospective viewer applications.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-3xl bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-50">
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 pl-6 py-4">Applicant</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4">Interest & Purpose</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map(req => (
                  <TableRow key={req.id} className="hover:bg-slate-50/50 group border-slate-50">
                    <TableCell className="pl-6 py-5">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{req.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{req.company}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                          <Mail className="w-3 h-3" />
                          {req.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px] space-y-1">
                        <p className="text-xs font-bold text-slate-700 truncate">{req.surveyRequested}</p>
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-2 italic">{req.purpose}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-black px-2 py-0.5 uppercase tracking-widest",
                        req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      )}>{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-1">
                      {req.status === 'PENDING' ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-emerald-600 hover:bg-emerald-50 h-9 rounded-xl font-bold" 
                            disabled={processingId === req.id}
                            onClick={() => handleApproveAndCreate(req)}
                          >
                            {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 mr-1" />}
                            {processingId === req.id ? "Creating..." : "Approve & Create"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-rose-600 hover:bg-rose-50 h-9 rounded-xl font-bold" 
                            onClick={() => handleReject(req.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-slate-300">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Processed {new Date(req.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(req.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!requests?.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-24 text-slate-400 uppercase text-xs font-bold tracking-widest">
                      No access requests pending
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
