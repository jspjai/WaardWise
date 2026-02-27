"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Globe, 
  Lock,
  UserCheck,
  Zap,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSettings() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Admin Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure global application behavior and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "general", label: "General Config", icon: Settings },
            { id: "security", label: "Security & Auth", icon: Shield },
            { id: "data", label: "Data Pipeline", icon: Database },
            { id: "notifications", label: "Alerts & Notifications", icon: Bell },
            { id: "localization", label: "Ward Localization", icon: Globe },
          ].map((item, i) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                i === 0 ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
              {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-6">
              <CardTitle className="text-lg font-headline font-bold">General Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Branding</Label>
                  <Input defaultValue="TRS Group" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support Email</Label>
                  <Input defaultValue="ops@trsgroup.com" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/20">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">Enable Multi-Ward Sync</p>
                      <p className="text-xs text-slate-400">Allow data aggregation across multiple administrative zones.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/20">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">Automatic AI Extraction</p>
                      <p className="text-xs text-slate-400">Process field notes through NLP instantly on submission.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/20">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">High Visibility Dashboard</p>
                      <p className="text-xs text-slate-400">Enable high-contrast charts for outdoor field tablets.</p>
                    </div>
                    <Switch />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-6">
              <CardTitle className="text-lg font-headline font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Button variant="outline" className="h-16 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 justify-start px-6 transition-all hover:bg-slate-50">
                  <Zap className="w-5 h-5 mr-3 text-amber-500" />
                  Flush Cache
               </Button>
               <Button variant="outline" className="h-16 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 justify-start px-6 transition-all hover:bg-slate-50">
                  <Lock className="w-5 h-5 mr-3 text-primary" />
                  Audit Logs
               </Button>
               <Button variant="outline" className="h-16 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 justify-start px-6 transition-all hover:bg-slate-50">
                  <UserCheck className="w-5 h-5 mr-3 text-emerald-500" />
                  Manage Admins
               </Button>
               <Button className="h-16 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]">
                  <Save className="w-5 h-5 mr-3" />
                  Save Changes
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
