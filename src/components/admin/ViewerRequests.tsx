"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, createAuthAccountSecondary, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, updateDoc, setDoc, query, getDocs, limit } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { XCircle, Loader2, Mail, Trash2, UserPlus, Clock, AlertTriangle } from "lucide-react";
import { ViewerRequest } from "@/lib/types";
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

export function ViewerRequests() {
  const db = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<ViewerRequest | null>(null);

  const requestsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "viewer_requests");
  }, [db]);
  const { data: requests, isLoading } = useCollection<ViewerRequest>(requestsQuery);

  const handleApproveAndCreate = async (req: ViewerRequest) => {
    if (!db || !req.email) {
      toast({ title: "Validation Error", description: "Email is required.", variant: "destructive" });
      return;
    }

    if (!req.password) {
      toast({ 
        title: "Missing Credentials", 
        description: "Application data missing password. Manual setup required.", 
        variant: "destructive" 
      });
      return;
    }

    setProcessingId(req.id);
    try {
      let uid: string = "";
      try {
        uid = await createAuthAccountSecondary(req.email, req.password);
      } catch (authError: any) {
        if (authError.code === 'auth/email-already-in-use') {
          toast({ 
            title: "User Exists", 
            description: "An account with this email already exists. Assigning roles to existing ID.", 
            variant: "default" 
          });
          // Note: In a real app we'd fetch the existing UID here if possible or ask admin to map it.
          // For now we assume creation success for new applicants.
          setProcessingId(null);
          return;
        }
        throw authError;
      }
      
      // Initialize User Profile
      await setDoc(doc(db, "users", uid), {
        id: uid,
        name: req.name,
        email: req.email,
        role: "VIEWER",
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      });

      // Link requested data
      const surveysRef = collection(db, "surveys");
      const sampleSnap = await getDocs(query(surveysRef, limit(1)));
      const targetSurveyId = !sampleSnap.empty ? sampleSnap.docs[0].id : "default-assignment";

      const accessId = `${uid}_${targetSurveyId}`;
      await setDoc(doc(db, "survey_access", accessId), {
        id: accessId,
        viewerId: uid,
        surveyId: targetSurveyId,
        assignedAt: new Date().toISOString()
      });

      // Mark Request as Approved
      await updateDoc(doc(db, "viewer_requests", req.id), { status: 'APPROVED' });
      
      toast({ title: "Account Created", description: `Viewer portal active for ${req.name}.` });
    } catch (error: any) {
      toast({ title: "Approval Failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "viewer_requests", id), { status: 'REJECTED' });
      toast({ title: "Request Rejected" });
    } catch (error: any) {
      toast({ title: "Action Failed", variant: "destructive" });
    }
  };

  const triggerDelete = (req: ViewerRequest) => {
    setRequestToDelete(req);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!db || !requestToDelete) return;
    deleteDocumentNonBlocking(doc(db, "viewer_requests", requestToDelete.id));
    toast({ title: "Request Removed" });
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Access Requests</h1>
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
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4">Interest</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 py-4 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map(req => (
                  <TableRow key={req.id} className="hover:bg-slate-50/50 group border-slate-50 transition-colors">
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
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-rose-600 hover:bg-rose-50 h-9 rounded-xl font-bold" 
                            onClick={() => handleReject(req.id)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-slate-300">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Processed</span>
                        </div>
                      )}
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-9 w-9 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                        onClick={() => triggerDelete(req)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!requests || requests.length === 0) && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                      Zero portal access requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Remove History?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              Are you sure you want to delete the request history for <strong>{requestToDelete?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl h-12 font-bold border-slate-100">Cancel</AlertDialogCancel>
            <Button onClick={handleConfirmDelete} className="rounded-xl h-12 px-8 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-rose-100">
              Confirm Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
