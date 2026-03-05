"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  MapPin,
  TrendingUp,
  Filter,
  UserPlus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_SURVEYORS = [
  { id: "s-1", name: "Rahul Sharma", email: "rahul@trs.pro", isActive: true, assignedWardIds: ["ward-80", "ward-81"] },
  { id: "s-2", name: "Priya V", email: "priya@trs.pro", isActive: true, assignedWardIds: ["ward-80"] },
  { id: "s-3", name: "Amit Singh", email: "amit@trs.pro", isActive: false, assignedWardIds: ["ward-82"] },
  { id: "s-4", name: "Sneha Kapur", email: "sneha@trs.pro", isActive: true, assignedWardIds: ["ward-81", "ward-83"] },
];

export function SurveyorsManagement() {
  const db = useFirestore();
  const { user } = useUser();
  const surveyorsQuery = useMemoFirebase(() => collection(db, "surveyors"), [db]);
  const { data: firestoreSurveyors, isLoading } = useCollection(surveyorsQuery);

  const isDemo = user?.isAnonymous;
  const surveyors = (firestoreSurveyors && firestoreSurveyors.length > 0) ? firestoreSurveyors : (isDemo ? MOCK_SURVEYORS : []);

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
          { label: "Active Team", value: surveyors?.filter(s => s.isActive).length || "0", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Recruits", value: surveyors?.length || "0", icon: Clock, color: "text-slate-500", bg: "bg-slate-50" },
          { label: "Top Region", value: "Bengaluru Central", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
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

      {isLoading && !isDemo ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {surveyors?.map((person) => (
            <Card key={person.id} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl group hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
                      {person.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{person.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">ID: {person.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={person.isActive ? "default" : "outline"}
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5",
                      person.isActive ? "bg-emerald-500 hover:bg-emerald-600" : "text-slate-400 border-slate-200"
                    )}
                  >
                    {person.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Assigned Wards</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <MapPin className="w-3 h-3 text-primary" />
                      {person.assignedWardIds?.length || 0} Districts
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Email</span>
                    <span className="font-bold text-slate-600 truncate max-w-[120px]">{person.email}</span>
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
          {(!surveyors || surveyors.length === 0) && !isLoading && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No surveyors found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}