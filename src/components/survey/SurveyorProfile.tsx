
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Shield, 
  Award,
  TrendingUp,
  FileText,
  Target,
  Edit2
} from "lucide-react";
import { cn } from "@/lib/utils";

const performanceStats = [
  { label: "Total Surveys", value: "142", target: "200", color: "bg-primary" },
  { label: "Ward Coverage", value: "68%", target: "80%", color: "bg-emerald-500" },
  { label: "Submission Rate", value: "98%", target: "100%", color: "bg-amber-500" },
];

export function SurveyorProfile() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        {/* Profile Card */}
        <Card className="w-full md:w-80 border-none shadow-sm bg-white shrink-0 overflow-hidden">
          <div className="h-24 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-300" />
                </div>
              </div>
            </div>
          </div>
          <CardContent className="pt-16 pb-8 px-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-headline font-extrabold text-slate-900 tracking-tight">John Doe</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Field Surveyor</p>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100">
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email</p>
                  <p className="text-xs font-bold text-slate-700 truncate">john.doe@wardwise.pro</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone</p>
                  <p className="text-xs font-bold text-slate-700">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Assigned Ward</p>
                  <p className="text-xs font-bold text-slate-700">Indiranagar (Ward 80)</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Status</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">Online</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Progress */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-white p-5 group hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">94%</h3>
                </div>
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-bold mt-4">+3% from last week</p>
            </Card>
            <Card className="border-none shadow-sm bg-white p-5 group hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submissions</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">1,204</h3>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-bold mt-4">Lifetime total</p>
            </Card>
            <Card className="border-none shadow-sm bg-white p-5 group hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Rank</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Gold</h3>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-[11px] text-amber-600 font-bold mt-4">Top 5% in Ward</p>
            </Card>
          </div>

          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Target Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-8">
              {performanceStats.map((stat) => (
                <div key={stat.label} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-slate-700">{stat.label}</p>
                      <p className="text-[10px] font-medium text-slate-400">Target: {stat.target}</p>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">{stat.value}</span>
                  </div>
                  <Progress value={parseInt(stat.value)} className="h-2 bg-slate-50" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Button variant="outline" className="h-14 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 shadow-sm">
               <Shield className="w-4 h-4 mr-2 text-primary" />
               View Certifications
             </Button>
             <Button className="h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
               <TrendingUp className="w-4 h-4 mr-2" />
               View Full Performance
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
