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
  FileText
} from "lucide-react";
import { Ward } from "@/lib/types";
import { cn } from "@/lib/utils";

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

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-slate-900">Ward Market</h1>
        <p className="text-slate-500 mt-1">Unlock high-quality survey data for your target wards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wards.map((ward) => (
          <Card key={ward.id} className={cn("border-none shadow-sm transition-all overflow-hidden", ward.unlocked ? "ring-2 ring-primary/20" : "bg-white")}>
            <div className={cn("h-2", ward.unlocked ? "bg-primary" : "bg-slate-200")} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-200">
                  {ward.district}
                </Badge>
                {ward.unlocked ? (
                  <div className="bg-emerald-50 p-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                ) : (
                  <Lock className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <CardTitle className="text-xl font-headline font-bold mt-2">{ward.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4 border-b border-slate-50">
                <div className="text-center flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Total Surveys</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">{ward.surveyCount.toLocaleString()}</p>
                </div>
                <div className="w-px h-8 bg-slate-100 mx-4" />
                <div className="text-center flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Status</p>
                  <p className={cn("text-xs font-bold mt-2", ward.unlocked ? "text-emerald-600" : "text-slate-500")}>
                    {ward.unlocked ? "Ready for Analysis" : "Data Available"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {ward.unlocked ? (
                  <>
                    <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl font-bold h-11 shadow-lg shadow-primary/10">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Ward Analysis
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg h-9 text-xs border-slate-200 font-bold">
                        <FileSpreadsheet className="w-3 h-3 mr-1.5" />
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg h-9 text-xs border-slate-200 font-bold">
                        <FileText className="w-3 h-3 mr-1.5" />
                        PDF
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 rounded-xl font-bold h-11">
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock Ward Data
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
