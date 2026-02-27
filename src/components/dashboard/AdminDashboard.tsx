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
  Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const data = [
  { name: 'Water', value: 45, color: '#4F46E5' },
  { name: 'Roads', value: 30, color: '#10B981' },
  { name: 'Garbage', value: 20, color: '#F59E0B' },
  { name: 'Safety', value: 15, color: '#EF4444' },
  { name: 'Drainage', value: 25, color: '#6366F1' },
];

const sentimentData = [
  { name: 'Pro-Change', value: 42, color: '#4F46E5' },
  { name: 'Neutral', value: 28, color: '#94A3B8' },
  { name: 'Pro-Continuity', value: 30, color: '#10B981' },
];

const stats = [
  { label: "Total Surveys", value: "24,842", icon: FileText, change: "+12.5%", positive: true },
  { label: "Active Wards", value: "48", icon: MapPin, change: "+2", positive: true },
  { label: "Field Surveyors", value: "156", icon: Users, change: "+12", positive: true },
  { label: "Avg Sentiment", value: "Neutral", icon: Activity, change: "-3%", positive: false },
];

export function AdminDashboard() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time pulse of all surveyed wards and field data.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search ward or booth..." className="pl-10 bg-white border-slate-200 rounded-xl" />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.positive ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                    <span className={cn("text-xs font-bold", stat.positive ? "text-emerald-500" : "text-red-500")}>
                      {stat.change}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <stat.icon className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline font-bold">Priority Issues by Ward</CardTitle>
            <select className="text-xs font-bold bg-slate-50 border-none rounded-lg px-2 py-1 outline-none text-slate-500">
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-headline font-bold">Political Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="240">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-3 px-4 mt-2">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
