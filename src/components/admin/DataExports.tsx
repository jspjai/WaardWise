"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileJson,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const datasets = [
  { id: "EXP-101", name: "Indiranagar Full Survey Data", records: "1,240", lastUpdated: "2h ago", format: "CSV" },
  { id: "EXP-102", name: "Malleshwaram Voter Sentiments", records: "890", lastUpdated: "5h ago", format: "JSON" },
  { id: "EXP-103", name: "Koramangala Issue Matrix", records: "412", lastUpdated: "1d ago", format: "XLSX" },
  { id: "EXP-104", name: "Master Ward Analytics Q1", records: "12,842", lastUpdated: "3d ago", format: "PDF" },
  { id: "EXP-105", name: "Youth Demographic Deep-dive", records: "3,200", lastUpdated: "5d ago", format: "CSV" },
];

export function DataExports() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Data Exports</h1>
          <p className="text-sm text-slate-500 mt-1">Download and manage your ward intelligence datasets.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
          <Plus className="w-4 h-4 mr-2" />
          Generate New Dataset
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-slate-900 text-white rounded-3xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-left">
              <Badge className="bg-primary hover:bg-primary border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                Real-time Sync
              </Badge>
              <h2 className="text-2xl md:text-3xl font-headline font-bold">Export Master Data Cloud</h2>
              <p className="text-slate-400 text-sm max-w-lg">
                Instantly generate a consolidated report for all <span className="text-white font-bold">24,842 records</span> across 48 wards.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl h-12 px-8 font-bold">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Master CSV
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-xl h-12 px-8 font-bold">
                  <FileJson className="w-4 h-4 mr-2" />
                  API Export
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-72 aspect-square rounded-3xl bg-white/5 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
               <RefreshCw className="w-24 h-24 text-white/10 animate-spin-slow" />
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl font-extrabold tracking-tighter">98.2%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Index</span>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-headline font-bold text-slate-900">Available Datasets</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-lg text-xs font-bold text-slate-500">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              Latest
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-lg text-xs font-bold text-slate-500">
              <Filter className="w-3.5 h-3.5 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {datasets.map((set) => (
            <Card key={set.id} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl group hover:shadow-md transition-all">
              <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                  set.format === "CSV" ? "bg-emerald-50 text-emerald-600" :
                  set.format === "JSON" ? "bg-blue-50 text-blue-600" :
                  "bg-slate-50 text-slate-600"
                )}>
                  {set.format === "CSV" ? <FileSpreadsheet className="w-6 h-6" /> :
                   set.format === "JSON" ? <FileJson className="w-6 h-6" /> :
                   <FileText className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{set.name}</h4>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {set.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{set.records} Records</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Synced {set.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button className="flex-1 md:flex-none bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl h-11 px-6 font-bold text-xs uppercase transition-all">
                    View
                  </Button>
                  <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 font-bold text-xs uppercase shadow-lg shadow-primary/10 transition-all">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const Plus = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
