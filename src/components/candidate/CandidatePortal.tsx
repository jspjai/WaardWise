"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Unlock, 
  TrendingUp, 
  CheckCircle,
  FileSpreadsheet,
  FileText,
  ArrowLeft,
  Users,
  Activity,
  MessageSquare
} from "lucide-react";
import { Ward } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WardAnalysis } from "./WardAnalysis";

const mockWards: Ward[] = [
  { id: "1", name: "Indiranagar", district: "Bengaluru Central", surveyCount: 1240, unlocked: true },
  { id: "2", name: "Koramangala", district: "Bengaluru South", surveyCount: 890, unlocked: false },
  { id: "3", name: "HSR Layout", district: "Bengaluru South", surveyCount: 1560, unlocked: true },
  { id: "4", name: "Jayanagar", district: "Bengaluru South", surveyCount: 2100, unlocked: false },
  { id: "5", name: "Whitefield", district: "Bengaluru East", surveyCount: 750, unlocked: false },
  { id: "6", name: "Malleshwaram", district: "Bengaluru North", surveyCount: 1100, unlocked: true },
];

export function CandidatePortal() {
  const [wards] = useState(mockWards);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  if (selectedWard) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedWard(null)}
            className="rounded-full hover:bg-slate-100 h-10 w-10 p-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-headline font-extrabold text-slate-900 tracking-tight">{selectedWard.name} Analysis</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{selectedWard.district}</p>
          </div>
        </div>
        <WardAnalysis ward={selectedWard} />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Ward Market</h1>
        <p className="text-sm text-slate-500 mt-1">Unlock high-quality survey data for your target wards.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {wards.map((ward) => (
          <Card key={ward.id} className={cn(
            "group border-none shadow-sm transition-all duration-300 overflow-hidden bg-white", 
            ward.unlocked ? "ring-2 ring-primary/20 shadow-md" : "hover:shadow-md"
          )}>
            <div className={cn("h-1.5", ward.unlocked ? "bg-primary" : "bg-slate-100")} />
            <CardHeader className="pb-2 px-5 md:px-6">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-100 bg-slate-50/50">
                  {ward.district}
                </Badge>
                {ward.unlocked ? (
                  <div className="bg-emerald-50 p-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-1.5 rounded-full">
                    <Lock className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
              <CardTitle className="text-xl font-headline font-bold mt-3 tracking-tight">{ward.name}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 md:px-6 pt-0">
              <div className="flex items-center justify-between py-5 border-y border-slate-50 mt-2">
                <div className="text-center flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Surveys</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-0.5">{ward.surveyCount.toLocaleString()}</p>
                </div>
                <div className="w-px h-10 bg-slate-50 mx-2" />
                <div className="text-center flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                  <p className={cn(
                    "text-[11px] font-extrabold mt-1 uppercase tracking-tight", 
                    ward.unlocked ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {ward.unlocked ? "Unlocked" : "Locked"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {ward.unlocked ? (
                  <>
                    <Button 
                      onClick={() => setSelectedWard(ward)}
                      className="w-full bg-primary hover:bg-primary/90 rounded-xl font-bold h-12 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analysis
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl h-10 text-[10px] border-slate-100 bg-slate-50/30 font-bold text-slate-600">
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-2" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl h-10 text-[10px] border-slate-100 bg-slate-50/30 font-bold text-slate-600">
                        <FileText className="w-3.5 h-3.5 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold h-12 transition-all">
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock Data
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
