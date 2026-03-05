
"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SurveyorSubmissions() {
  const { user } = useUser();
  const db = useFirestore();

  const submissionsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "surveys"), where("surveyorId", "==", user.uid));
  }, [db, user]);

  const { data: submissions, isLoading } = useCollection(submissionsQuery);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">My Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">History of all surveys you have conducted.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search household..." className="pl-10 bg-white border-slate-100 h-11 rounded-xl" />
          </div>
          <Button variant="outline" className="rounded-xl h-11 border-slate-100 bg-white">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 md:hidden gap-4">
            {submissions?.map((sub) => (
              <Card key={sub.id} className="border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{sub.respondentName || "Household"}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">ID: {sub.id.slice(0, 8)}</p>
                    </div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold px-2 py-0.5">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Synced
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      Booth {sub.boothNumber || sub.boothId}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {new Date(sub.surveyDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                      sub.householdVoterMood === "Pro-change" ? "bg-primary/10 text-primary" : 
                      sub.householdVoterMood === "Pro-continuity" ? "bg-emerald-50 text-emerald-600" : 
                      "bg-slate-100 text-slate-600"
                    )}>
                      {sub.householdVoterMood}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-50">
                      <Eye className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden md:block border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Household</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Booth</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Date</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Sentiment</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions?.map((sub) => (
                  <TableRow key={sub.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-slate-500 text-xs">{sub.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-bold text-slate-900">{sub.respondentName || "Household"}</TableCell>
                    <TableCell className="font-medium text-slate-600">{sub.boothNumber || sub.boothId}</TableCell>
                    <TableCell className="text-slate-500 text-xs">{new Date(sub.surveyDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        sub.householdVoterMood === "Pro-change" ? "bg-primary/10 text-primary" : 
                        sub.householdVoterMood === "Pro-continuity" ? "bg-emerald-50 text-emerald-600" : 
                        "bg-slate-100 text-slate-600"
                      )}>
                        {sub.householdVoterMood}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600">Synced</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}
