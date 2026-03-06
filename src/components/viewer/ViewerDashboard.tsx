
"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where, getDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Lock, Loader2, Database, MessageSquare, Send } from "lucide-react";
import { Survey, SurveyAccess } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ViewerDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [assignedSurveys, setAssignedSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  const accessQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "survey_access"), where("viewerId", "==", user.uid));
  }, [db, user]);

  const { data: accessMappings, isLoading: isAccessLoading } = useCollection<SurveyAccess>(accessQuery);

  useEffect(() => {
    if (!db || isAccessLoading) return;

    if (!accessMappings || accessMappings.length === 0) {
      setAssignedSurveys([]);
      setLoading(false);
      return;
    }

    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const surveys: Survey[] = [];
        for (const mapping of accessMappings) {
          if (!mapping.surveyId || mapping.surveyId === 'default-assignment') continue;
          
          try {
            const docRef = doc(db, "surveys", mapping.surveyId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              surveys.push({ id: snap.id, ...snap.data() } as Survey);
            }
          } catch (e) {
            console.warn(`Could not fetch survey ${mapping.surveyId}`);
          }
        }
        setAssignedSurveys(surveys);
      } catch (error) {
        console.error("Error fetching viewer surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [accessMappings, isAccessLoading, db]);

  const handleSendSupport = async () => {
    if (!supportMessage.trim() || !user || !db) return;
    setIsSending(true);
    
    try {
      await addDoc(collection(db, "support_tickets"), {
        viewerId: user.uid,
        viewerName: user.displayName || "Authorized Viewer",
        viewerEmail: user.email,
        message: supportMessage,
        status: 'OPEN',
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Ticket Created",
        description: "Your request has been routed to the administrative team.",
      });
      setIsSupportOpen(false);
      setSupportMessage("");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading || isAccessLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">Validating Authorized Datasets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Your Data Portfolio</h1>
          <p className="text-slate-500 text-sm mt-1">Authorized datasets assigned to your organization.</p>
        </div>
        <Badge variant="outline" className="border-emerald-100 text-emerald-600 bg-emerald-50 px-3 py-1 font-bold">
          {assignedSurveys.length} ACTIVE DATASETS
        </Badge>
      </div>

      {assignedSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedSurveys.map(s => (
            <Card key={s.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white rounded-3xl group">
              <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
              <CardHeader className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5">Assigned</Badge>
                  <FileText className="w-5 h-5 text-slate-200" />
                </div>
                <CardTitle className="text-xl font-headline font-bold text-slate-900 leading-tight">{s.title || "Voter Sentiment Report"}</CardTitle>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {s.description || `Voter data for ${s.wardId || 'Target Ward'} - Compiled on ${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}`}
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="flex items-center gap-6 py-4 border-y border-slate-50 mb-6 bg-slate-50/30 rounded-xl px-4">
                  <div className="text-center flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status</p>
                    <p className="text-xs font-black text-emerald-600 uppercase">Live</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100" />
                  <div className="text-center flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Format</p>
                    <p className="text-xs font-black text-slate-900 uppercase">Intelligence</p>
                  </div>
                </div>
                <Button className="w-full h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50 transition-all hover:scale-[1.02]">
                  <Download className="w-4 h-4 mr-2" />
                  Access Full Dataset
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-slate-200 bg-white/50 text-center p-20 rounded-3xl">
          <Lock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">No Active Assignments</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">Your organization currently has no active survey data mappings. Contact your account manager for authorization.</p>
        </Card>
      )}

      <Card className="border-none shadow-sm bg-primary text-white p-8 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-headline font-bold">Need additional insights?</h3>
              <p className="text-primary-foreground/80 text-sm">Request custom ward-level deep dives from our analyst team.</p>
            </div>
          </div>
          
          <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-primary hover:bg-slate-100 rounded-xl h-12 px-8 font-bold text-sm whitespace-nowrap shadow-xl">
                Contact Support
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl border-none">
              <DialogHeader>
                <DialogTitle className="font-headline font-bold text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Request Insights
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Provide details about the specific data or ward analysis you require. Our strategic team will respond within 24 hours.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Your Message</Label>
                  <Textarea 
                    placeholder="Describe your requirements..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="min-h-[120px] rounded-xl bg-slate-50 border-slate-100 resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSendSupport} 
                  disabled={isSending || !supportMessage.trim()}
                  className="w-full h-12 rounded-xl font-bold bg-primary shadow-lg shadow-primary/10"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
}
