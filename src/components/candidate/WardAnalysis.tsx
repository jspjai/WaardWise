"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Activity, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Target
} from "lucide-react";
import { Ward } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WardAnalysisProps {
  ward: Ward;
}

const issueData = [
  { name: 'Water', value: 78, color: '#4F46E5' },
  { name: 'Roads', value: 65, color: '#10B981' },
  { name: 'Garbage', value: 52, color: '#F59E0B' },
  { name: 'Safety', value: 45, color: '#EF4444' },
  { name: 'Drainage', value: 41, color: '#6366F1' },
];

const sentimentData = [
  { name: 'Positive', value: 35, color: '#10B981' },
  { name: 'Neutral', value: 45, color: '#94A3B8' },
  { name: 'Negative', value: 20, color: '#EF4444' },
];

const stats = [
  { label: "Surveys Conducted", value: "1,240", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Voter Turnout Est.", value: "72%", icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Key Grievances", value: "124", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Engagement Rate", value: "88%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export function WardAnalysis({ ward }: WardAnalysisProps) {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Top Ward Issues (Severity Score)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueData} layout="vertical" margin={{ left: -10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Chart */}
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              General Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 mt-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Summary Insights */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-white rounded-2xl border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              AI Qualitative Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Analysis of <span className="text-primary font-bold">1,240 responses</span> reveals that water supply remains the most critical pain point in <span className="font-bold">{ward.name}</span>. Respondents express significant frustration with intermittent supply schedules.
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-white/60 rounded-xl border border-white/80 shadow-sm flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 font-semibold">Majority of youth (18-25) are undecided but lean towards candidates focusing on local infrastructure.</p>
                </div>
                <div className="p-3 bg-white/60 rounded-xl border border-white/80 shadow-sm flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 font-semibold">Emerging trend: Growing demand for better public lighting in the southern clusters of the ward.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Strategy */}
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-4">
              {[
                "Host a Town Hall specifically addressing water management.",
                "Target social media campaigns to Booth 142-148 regarding new road projects.",
                "Emphasize transparency in governance to win over the 45% neutral segment."
              ].map((rec, i) => (
                <li key={i} className="flex gap-3 items-start group">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{rec}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
