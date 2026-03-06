
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Mail, ExternalLink, Trash2 } from "lucide-react";
import { ViewerRequest } from "@/lib/types";

export function ViewerRequests() {
  const db = useFirestore();
  const { toast } = useToast();

  const requestsQuery = useMemoFirebase(() => collection(db, "viewer_requests"), [db]);
  const { data: requests, isLoading } = useCollection<ViewerRequest>(requestsQuery);

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateDoc(doc(db, "viewer_requests", id), { status });
      toast({ title: `Request ${status.toLowerCase()}` });
    } catch (error) {
      toast({ title: "Update Failed", variant: "destructive" });
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
      <h1 className="text-2xl font-bold tracking-tight">Access Requests</h1>
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 pl-6">Applicant</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400">Interest</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-slate-400 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map(req => (
                  <TableRow key={req.id} className="hover:bg-slate-50/50 group">
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
                      <div className="max-w-[200px] space-y-1">
                        <p className="text-xs font-bold text-slate-700 truncate">{req.surveyRequested}</p>
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-2 italic">{req.purpose}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-black px-2 py-0.5 uppercase",
                        req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      )}>{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-1">
                      {req.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 h-9 rounded-xl" onClick={() => handleUpdateStatus(req.id, 'APPROVED')}>
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50 h-9 rounded-xl" onClick={() => handleUpdateStatus(req.id, 'REJECTED')}>
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(req.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!requests?.length && <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 uppercase text-xs font-bold tracking-widest">No requests found</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const cn = (...args: any[]) => args.filter(Boolean).join(' ');
