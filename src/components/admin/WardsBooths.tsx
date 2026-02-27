"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Map, 
  Search, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  Users,
  Building2,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockWards = [
  { id: "W1", name: "Indiranagar", district: "Central", booths: 24, coverage: "92%", surveyors: 8 },
  { id: "W2", name: "Malleshwaram", district: "North", booths: 18, coverage: "78%", surveyors: 6 },
  { id: "W3", name: "Koramangala", district: "South", booths: 32, coverage: "65%", surveyors: 12 },
  { id: "W4", name: "HSR Layout", district: "South", booths: 28, coverage: "84%", surveyors: 10 },
  { id: "W5", name: "Jayanagar", district: "South", booths: 20, coverage: "95%", surveyors: 7 },
];

export function WardsBooths() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Wards & Booths</h1>
          <p className="text-sm text-slate-500 mt-1">Manage geographic targets and polling station data.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
          <Plus className="w-4 h-4 mr-2" />
          Add New Ward
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Wards", value: "48", icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Booths", value: "1,240", icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Surveyors", value: "156", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg. Coverage", value: "82.4%", icon: ChevronRight, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardContent className="p-4 md:p-5 flex flex-col gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search wards by name or district..." className="pl-10 bg-white border-slate-100 h-11 rounded-xl" />
        </div>
        <Button variant="outline" className="rounded-xl h-11 border-slate-100 bg-white font-bold text-slate-600">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {mockWards.map((ward) => (
          <Card key={ward.id} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl group hover:shadow-md transition-all">
            <CardContent className="p-0">
              <div className="p-5 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-headline font-bold text-slate-900">{ward.name}</h3>
                    <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-100">
                      {ward.district}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Ward ID: {ward.id}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-50">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 border-y border-slate-50 bg-slate-50/30">
                <div className="p-4 text-center border-r border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Booths</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">{ward.booths}</p>
                </div>
                <div className="p-4 text-center border-r border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Coverage</p>
                  <p className="text-sm font-extrabold text-emerald-600 mt-1">{ward.coverage}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Surveyors</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">{ward.surveyors}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    +{ward.surveyors - 3}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary font-bold text-xs hover:bg-primary/5">
                  Manage Booths
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
