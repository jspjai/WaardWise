
"use client";

import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { SupportTicket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function TicketsManagement() {
  const db = useFirestore();
  const { toast } = useToast();

  const ticketsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "support_tickets"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: tickets, isLoading } = useCollection<SupportTicket>(ticketsQuery);

  const handleUpdateStatus = (ticketId: string, status: SupportTicket['status']) => {
    if (!db) return;
    const ticketRef = doc(db, "support_tickets", ticketId);
    updateDocumentNonBlocking(ticketRef, { status });
    toast({ title: `Ticket ${status}`, description: "Status updated successfully." });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Support Tickets</h1>
        <p className="text-sm text-slate-500 mt-1">Manage inquiries and insight requests from authorized viewers.</p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-3xl bg-white">
        <CardHeader className="border-b border-slate-50 p-6">
          <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Active Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-50 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400 pl-6">Viewer</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400">Request Details</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets?.map((ticket) => (
                  <TableRow key={ticket.id} className="border-slate-50 transition-colors">
                    <TableCell className="pl-6 py-5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">{ticket.viewerName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{ticket.viewerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md space-y-1">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{ticket.message}</p>
                        <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                        ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      )}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-2">
                      {ticket.status !== 'RESOLVED' ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-primary hover:bg-primary/5 h-8 rounded-lg font-bold text-[10px]"
                            onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                          >
                            In Progress
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-emerald-600 hover:bg-emerald-50 h-8 rounded-lg font-bold text-[10px]"
                            onClick={() => handleUpdateStatus(ticket.id, 'RESOLVED')}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase italic">Closed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!tickets || tickets.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                      Zero active support inquiries
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
