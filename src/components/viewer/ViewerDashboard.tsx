
"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Lock, Loader2, Database } from "lucide-react";
import { Survey, SurveyAccess } from "@/lib/types";

export function ViewerDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [assignedSurveys, setAssignedSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Get Access Mappings
  const accessQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "survey_access"), where("viewerId", "==", user.uid));
  }, [db, user]);

  const { data: accessMappings } = useCollection<SurveyAccess>(accessQuery);

  // 2. Fetch Actual Surveys based on mappings
  useEffect(() => {
    if (!accessMappings || !db) {
      if (accessMappings === null) setLoading(false);
      return;
    }

    const fetchSurveys = async () => {
      setLoading(true);
      const surveys: Survey[] = [];
      for (const mapping of accessMappings) {
        const docRef = doc(db, "surveys", mapping.surveyId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          surveys.push({ id: snap.id, ...snap.data() } as Survey);
        }
      }
      setAssignedSurveys(surveys);
      setLoading(false);
    };

    fetchSurveys();
  }, [accessMappings, db]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Data Portfolio</h1>
        <p className="text-slate-500 text-sm mt-1">Authorized datasets assigned to your organization.</p>
      </div>

      {loading ? (
        <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin w-10 h-10" />
          <p className="text-xs font-bold uppercase tracking-widest">Validating Credentials...</p>
        </div>
      ) : assignedSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedSurveys.map(s => (
            <Card key={s.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
              <div className="h-2 bg-primary/20" />
              <CardHeader className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5">Assigned</Badge>
                  <FileText className="w-5 h-5 text-slate-200" />
                </div>
                <CardTitle className="text-xl font-bold">{s.title}</CardTitle>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed italic">{s.description || "Comprehensive ward-level voter sentiment analysis."}</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="flex items-center gap-6 py-4 border-y border-slate-50 mb-6">
                  <div className="text-center flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Records</p>
                    <p className="text-lg font-black text-slate-900">4,200</p>
                  </div>
                  <div className="text-center flex-1 border-l border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Format</p>
                    <p className="text-lg font-black text-slate-900 uppercase">PDF</p>
                  </div>
                </div>
                <Button className="w-full h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200">
                  <Download className="w-4 h-4 mr-2" />
                  Access Full Dataset
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-transparent text-center p-20">
          <Lock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">No Active Assignments</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">Your organization currently has no active survey data mappings. Contact your account manager for authorization.</p>
        </Card>
      )}

      <Card className="border-none shadow-sm bg-primary text-white p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Need additional insights?</h3>
              <p className="text-primary-foreground/80 text-sm">Request custom ward-level deep dives from our analyst team.</p>
            </div>
          </div>
          <Button className="bg-white text-primary hover:bg-white/90 rounded-xl h-12 px-8 font-bold text-sm">Contact Support</Button>
        </div>
      </Card>
    </div>
  );
}

import { getDoc, doc } from "firebase/firestore";
