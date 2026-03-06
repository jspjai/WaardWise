"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar, 
  MapPin, 
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const mockReports: any[] = [];

export function CandidateReports() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">My Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generated intelligence and exported ward datasets.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search reports..." className="pl-10 bg-white border-slate-100 h-11 rounded-xl" />
          </div>
          <Button variant="outline" className="rounded-xl h-11 border-slate-100 bg-white">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {mockReports.map((report) => (
          <Card key={report.id} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all rounded-2xl">
            <CardHeader className="p-5 pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 uppercase">
                  {report.type}
                </Badge>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{report.size}</span>
              </div>
              <CardTitle className="text-lg font-headline font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                {report.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{report.ward}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{report.date}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Ready</span>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-lg h-9 font-bold px-4">
                  <Download className="w-3.5 h-3.5 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {mockReports.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No reports generated yet</p>
          </div>
        )}
      </div>

      <Card className="border-none shadow-sm bg-slate-900 text-white rounded-2xl overflow-hidden mt-8">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-headline font-bold">Request Custom Intelligence Report</h3>
            <p className="text-slate-400 text-sm max-w-lg">Need a deep dive into specific booth demographics or community patterns? Request a custom AI-generated report.</p>
          </div>
          <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl h-12 px-8 font-bold whitespace-nowrap">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Request Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
