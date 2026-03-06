
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
  MapPin, 
  FileText, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Initializing as empty for production clean slate
const data = [];

const sentimentData = [
  { name: 'Pro-Change', value: 0, color: '#4F46E5' },
  { name: 'Neutral', value: 0, color: '#94A3B8' },
  { name: 'Pro-Continuity', value: 0, color: '#10B981' },
];

const stats = [
  { label: "Total Surveys", value: "0", icon: FileText, change: "0%", positive: true },
  { label: "Active Wards", value: "0", icon: MapPin, change: "0", positive: true },
  { label: "Field Surveyors", value: "0", icon: Users, change: "0", positive: true },
  { label: "Avg Sentiment", value: "N/A", icon: Activity, change: "0%", positive: true },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time pulse of all surveyed wards and field data.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search ward or booth..." className="pl-10 bg-white border-slate-200 rounded-xl h-10" />
          </div>
          <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden group transition-all hover:shadow-md">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-extrabold text-slate-900">{stat.value}</h3>
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className={cn(
                      "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                      stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {stat.positive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {stat.change}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">this month</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <stat.icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50 px-5 md:px-6">
            <CardTitle className="text-lg font-headline font-bold">Priority Issues by Ward</CardTitle>
            <select className="text-[10px] font-bold bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 outline-none text-slate-600 appearance-none cursor-pointer">
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </CardHeader>
          <CardContent className="p-4 md:p-6 h-[300px] md:h-[400px]">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <FileText className="w-8 h-8 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No issue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-50 px-5 md:px-6">
            <CardTitle className="text-lg font-headline font-bold">Political Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 flex flex-col items-center">
            <div className="w-full h-[220px] md:h-[260px]">
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
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2.5 mt-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
