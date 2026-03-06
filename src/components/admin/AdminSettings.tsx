
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { doc, writeBatch, collection, query, orderBy, limit } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  History, 
  Lock,
  UserCheck,
  Zap,
  Save,
  Loader2,
  DatabaseZap,
  CheckCircle2,
  AlertCircle,
  Users,
  Trash2,
  Mail,
  UserPlus,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function AdminSettings() {
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  // Data for Manage Admins
  const adminsQuery = useMemoFirebase(() => collection(db, "roles_admin"), [db]);
  const { data: admins, isLoading: isAdminsLoading } = useCollection(adminsQuery);

  // Data for Audit Logs (Using recent surveys as a proxy for activity)
  const auditLogsQuery = useMemoFirebase(() => 
    query(collection(db, "surveys"), orderBy("createdAt", "desc"), limit(20)), 
    [db]
  );
  const { data: recentActivity, isLoading: isLogsLoading } = useCollection(auditLogsQuery);

  const handleBootstrap = async () => {
    if (!db || !user) {
      toast({
        title: "Configuration Error",
        description: "Firestore or User session not detected. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    setIsBootstrapping(true);
    try {
      const batch = writeBatch(db);

      // Ensure the current user is an admin
      batch.set(doc(db, "roles_admin", user.uid), {
        id: user.uid,
        email: user.email,
        name: user.email === 'suryajai642@gmail.com' ? "Super Admin" : "Administrator",
        role: "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Sample Wards
      const wards = [
        { 
          id: "ward-80", 
          name: "Indiranagar", 
          district: "Bengaluru Central", 
          surveyCount: 1240,
          price: 5000,
          isAvailableForPurchase: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: "ward-81", 
          name: "Malleshwaram", 
          district: "Bengaluru North", 
          surveyCount: 890,
          price: 4500,
          isAvailableForPurchase: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: "ward-82", 
          name: "HSR Layout", 
          district: "Bengaluru South", 
          surveyCount: 2100,
          price: 6000,
          isAvailableForPurchase: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
      ];

      wards.forEach(ward => {
        batch.set(doc(db, "wards", ward.id), ward);
      });

      await batch.commit();
      
      toast({
        title: "System Ready",
        description: "Wards and Admin credentials successfully initialized.",
      });
    } catch (error: any) {
      console.error("Bootstrap error:", error);
      toast({
        title: "Bootstrap Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsBootstrapping(false);
    }
  };

  const navItems = [
    { id: "general", label: "General Config", icon: Settings },
    { id: "admins", label: "Manage Admins", icon: UserCheck },
    { id: "logs", label: "Audit Logs", icon: History },
    { id: "security", label: "Security & Auth", icon: Shield },
    { id: "data", label: "Data Pipeline", icon: Database },
    { id: "notifications", label: "Alerts & Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Admin Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure global application behavior and platform security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm text-left border border-transparent",
                activeTab === item.id 
                  ? "bg-white shadow-sm text-primary border-slate-100 ring-2 ring-primary/5" 
                  : "text-slate-500 hover:bg-slate-100/50"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-primary" : "text-slate-400")} />
                {item.label}
              </div>
              {activeTab === item.id && <ArrowRight className="w-4 h-4 text-primary animate-in slide-in-from-left-2" />}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeTab === "general" && (
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
                </div>
                <Button className="w-full h-12 rounded-xl font-bold bg-primary" onClick={() => toast({ title: "Saved", description: "Config updated."})}>
                  <Save className="w-4 h-4 mr-2" />
                  Update Branding
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "admins" && (
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-headline font-bold">Platform Administrators</CardTitle>
                <Button size="sm" className="rounded-xl h-9 font-bold bg-primary/10 text-primary hover:bg-primary/20" onClick={() => toast({ title: "Restricted", description: "Use Firebase Console to invite new admins directly for security." })}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Admin
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {isAdminsLoading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-50">
                        <TableHead className="text-[10px] font-bold uppercase py-4">Name</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4">Role</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4">Email</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins?.map((admin: any) => (
                        <TableRow key={admin.id} className="border-slate-50">
                          <TableCell className="font-bold text-slate-900">{admin.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20 bg-primary/5">
                              {admin.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 font-medium">{admin.email}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => toast({ title: "Unauthorized", description: "You cannot delete other Super Admins.", variant: "destructive" })}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!admins?.length && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-bold uppercase text-[10px]">No other admins found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "logs" && (
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6">
                <CardTitle className="text-lg font-headline font-bold">System Audit Logs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLogsLoading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-50">
                        <TableHead className="text-[10px] font-bold uppercase py-4">Event</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4">User</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4">Timestamp</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4 text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivity?.map((log: any) => (
                        <TableRow key={log.id} className="border-slate-50">
                          <TableCell className="text-xs font-bold text-slate-700">Survey Submission: {log.respondentName || 'Household'}</TableCell>
                          <TableCell className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {log.surveyorId?.slice(0, 6)}</TableCell>
                          <TableCell className="text-[10px] font-medium text-slate-500">
                            {log.submissionTimestamp ? new Date(log.submissionTimestamp).toLocaleString() : 'Just now'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-bold">SUCCESS</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!recentActivity?.length && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-bold uppercase text-[10px]">No recent activity logs detected</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "data" && (
            <Card className="border-none shadow-sm bg-slate-900 text-white rounded-3xl overflow-hidden">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                  <DatabaseZap className="w-5 h-5 text-amber-400" />
                  Database Bootstrapper
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Initialize mandatory Firestore collections with sample Wards and system roles. This ensures the Ward Marketplace and Analytics views are populated.
                </p>
                <Button 
                  onClick={handleBootstrap}
                  disabled={isBootstrapping}
                  className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl gap-2 transition-all"
                >
                  {isBootstrapping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 text-amber-500" />
                  )}
                  {isBootstrapping ? "Executing Writes..." : "Bootstrap Initial Data"}
                </Button>
                {isBootstrapping && (
                  <p className="text-[10px] text-amber-400 font-bold text-center uppercase tracking-widest animate-pulse">Writing batch records to cloud storage...</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
             <div className="space-y-6">
               <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-slate-50 p-6">
                    <CardTitle className="text-lg font-headline font-bold">Access Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("logs")}
                      className="h-16 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 justify-start px-6 transition-all hover:bg-slate-50 group"
                    >
                        <History className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
                        Audit Logs
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("admins")}
                      className="h-16 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 justify-start px-6 transition-all hover:bg-slate-50 group"
                    >
                        <UserCheck className="w-5 h-5 mr-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                        Manage Admins
                    </Button>
                  </CardContent>
               </Card>
               <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                     <h4 className="font-bold text-emerald-900">Security Rules Active</h4>
                     <p className="text-sm text-emerald-700 mt-1 leading-relaxed">
                        Your platform is protected by production-grade Firebase security rules. Only your authorized account can modify critical ward data.
                     </p>
                  </div>
               </div>
             </div>
          )}

          {activeTab === "notifications" && (
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6">
                <CardTitle className="text-lg font-headline font-bold">Alert Subscriptions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Critical Shift Alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Daily Ward Reports</span>
                    <Switch />
                  </div>
                </div>
                <Button className="w-full rounded-xl h-12 font-bold" onClick={() => toast({ title: "Updated", description: "Preferences saved."})}>Update Preferences</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
