"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Map, 
  TrendingUp, 
  Activity,
  AlertCircle,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryStats = [
  { label: "Wards Monitored", value: "0", icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Sample Size", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Avg Ward Sentiment", value: "N/A", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "High Risk Booths", value: "0", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
];

const unlockedWards: any[] = [];

export function CandidateAnalysisOverview() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Intelligence Analysis</h1>
        <p className="text-sm text-slate-500 mt-1">Cross-ward insights and strategic political intelligence.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 px-6">
            <CardTitle className="text-lg font-headline font-bold">Monitored Wards Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {unlockedWards.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {unlockedWards.map((ward) => (
                  <div key={ward.name} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">{ward.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">Critical Issues: {ward.issues}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sentiment</p>
                        <p className={cn(
                          "text-xs font-extrabold",
                          ward.sentiment === "Positive" ? "text-emerald-600" : "text-amber-600"
                        )}>{ward.sentiment}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <p className="text-xs font-bold uppercase tracking-widest">No active ward monitoring</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-white rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-headline font-bold mb-2">Campaign Edge AI</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-8">
              Unlock wards in the marketplace to see AI-generated strategic insights and voter volatility indices.
            </p>
            <div className="mt-auto">
              <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl font-bold">
                View Strategy Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-none shadow-sm bg-white rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Volatility Index</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Real-time volatility tracking requires active survey data from monitored wards.
                </p>
              </div>
            </div>
         </Card>
         <Card className="border-none shadow-sm bg-white rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Demographic Shift</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Demographic engagement rates are calculated as surveys are uploaded.
                </p>
              </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
