"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  MapPin,
  TrendingUp,
  Filter,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockSurveyors = [
  { id: "SV-001", name: "Rahul Sharma", ward: "Indiranagar", status: "Active", efficiency: "94%", surveys: 242 },
  { id: "SV-002", name: "Ananya Iyer", ward: "Malleshwaram", status: "Active", efficiency: "88%", surveys: 189 },
  { id: "SV-003", name: "Vikram Reddy", ward: "Koramangala", status: "Offline", efficiency: "72%", surveys: 412 },
  { id: "SV-004", name: "Priya Das", ward: "HSR Layout", status: "Active", efficiency: "91%", surveys: 156 },
  { id: "SV-005", name: "Suresh Kumar", ward: "Jayanagar", status: "Active", efficiency: "85%", surveys: 298 },
  { id: "SV-006", name: "Meera Nair", ward: "Indiranagar", status: "Offline", efficiency: "96%", surveys: 523 },
];

export function SurveyorsManagement() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Surveyors</h1>
          <p className="text-sm text-slate-500 mt-1">Manage field teams and performance tracking.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Surveyor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Active Now", value: "42", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Offline", value: "18", icon: Clock, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "Top Performer", value: "Meera N.", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
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
          <Input placeholder="Search surveyors by name..." className="pl-10 bg-white border-slate-100 h-11 rounded-xl" />
        </div>
        <Button variant="outline" className="rounded-xl h-11 border-slate-100 bg-white font-bold text-slate-600">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {mockSurveyors.map((person) => (
          <Card key={person.id} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{person.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{person.id}</p>
                  </div>
                </div>
                <Badge 
                  variant={person.status === "Active" ? "default" : "outline"}
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5",
                    person.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : "text-slate-400 border-slate-200"
                  )}
                >
                  {person.status}
                </Badge>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Assigned Ward</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <MapPin className="w-3 h-3 text-primary" />
                    {person.ward}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Efficiency</span>
                  <span className="font-bold text-emerald-600">{person.efficiency}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Total Surveys</span>
                  <span className="font-bold text-slate-900">{person.surveys.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-lg h-9 text-[10px] font-bold border-slate-100 text-slate-600">
                  View Performance
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-50">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
