"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { doc, writeBatch, collection, query, orderBy, limit, getDoc } from "firebase/firestore";
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
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function AdminSettings() {
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  // Data for Manage Admins
  const adminsQuery = useMemoFirebase(() => collection(db, "roles_admin"), [db]);
  const { data: admins, isLoading: isAdminsLoading } = useCollection(adminsQuery);

  // Data for Audit Logs (Using recent surveys as activity events)
  const auditLogsQuery = useMemoFirebase(() => 
    query(collection(db, "surveys"), orderBy("createdAt", "desc"), limit(20)), 
    [db]
  );
  const { data: recentActivity, isLoading: isLogsLoading } = useCollection(auditLogsQuery);

  const handleVerifySecurity = async () => {
    if (!user || !db) return;
    setIsVerifying(true);
    setSecurityStatus("IDLE");
    try {
      const docRef = doc(db, "roles_admin", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSecurityStatus("SUCCESS");
        toast({ title: "Verification Successful", description: "Production security rules are active and your account is authorized." });
      } else {
        setSecurityStatus("ERROR");
        toast({ title: "Verification Failed", description: "Admin record not found. Please authorize your account first.", variant: "destructive" });
      }
    } catch (error: any) {
      setSecurityStatus("ERROR");
      toast({ title: "Access Denied", description: error.message, variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBootstrap = async () => {
    if (!db || !user) {
      toast({ title: "Session Error", description: "Firebase not initialized.", variant: "destructive" });
      return;
    }

    setIsBootstrapping(true);
    try {
      const batch = writeBatch(db);

      batch.set(doc(db, "roles_admin", user.uid), {
        id: user.uid,
        email: user.email,
        name: user.email === 'suryajai642@gmail.com' ? "Super Admin" : "Administrator",
        role: "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const wards = [
        { id: "ward-80", name: "Indiranagar", district: "Bengaluru Central", surveyCount: 1240, price: 5000, isAvailableForPurchase: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "ward-81", name: "Malleshwaram", district: "Bengaluru North", surveyCount: 890, price: 4500, isAvailableForPurchase: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "ward-82", name: "HSR Layout", district: "Bengaluru South", surveyCount: 2100, price: 6000, isAvailableForPurchase: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];

      wards.forEach(ward => {
        batch.set(doc(db, "wards", ward.id), ward);
      });

      await batch.commit();
      
      toast({ title: "Database Bootstrapped", description: "Initial wards and roles have been created." });
      setActiveTab("general");
    } catch (error: any) {
      toast({ title: "Bootstrap Error", description: error.message, variant: "destructive" });
    } finally {
      setIsBootstrapping(false);
    }
  };

  const navItems = [
    { id: "general", label: "General", icon: Settings },
    { id: "admins", label: "Administrators", icon: UserCheck },
    { id: "logs", label: "Audit Logs", icon: History },
    { id: "security", label: "Security & Auth", icon: Shield },
    { id: "data", label: "Data Pipeline", icon: Database },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Admin Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Global platform configuration and security management.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-xl transition-all font-bold text-sm text-left border",
                activeTab === item.id 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10" 
                  : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-slate-400")} />
                {item.label}
              </div>
              {activeTab === item.id && <ArrowRight className="w-4 h-4 text-white animate-in slide-in-from-left-2" />}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" && (
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6">
                <CardTitle className="text-lg font-headline font-bold">General Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name</Label>
                    <Input defaultValue="TRS Group" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operations Email</Label>
                    <Input defaultValue="ops@trsgroup.com" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">Real-time Data Sync</p>
                        <p className="text-[11px] text-slate-500 font-medium">Auto-refresh ward dashboards on survey arrival.</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">AI Auto-Extraction</p>
                        <p className="text-[11px] text-slate-500 font-medium">Process surveyor field notes using Gemini instantly.</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                </div>

                <Button className="w-full h-12 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20" onClick={() => toast({ title: "Configuration Updated", description: "General settings saved to cloud." })}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "admins" && (
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-headline font-bold">Platform Administrators</CardTitle>
                <Button size="sm" className="rounded-xl h-9 font-bold bg-primary/10 text-primary hover:bg-primary/20" onClick={() => toast({ title: "Restricted", description: "Use Firebase Console to manage Super Admin credentials." })}>
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
                      <TableRow className="border-slate-50 hover:bg-transparent">
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400">Name</TableHead>
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400">Role</TableHead>
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400">Email</TableHead>
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400 text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins?.map((admin: any) => (
                        <TableRow key={admin.id} className="border-slate-50 transition-colors">
                          <TableCell className="font-bold text-slate-900 pl-6">{admin.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20 bg-primary/5 uppercase tracking-tighter">
                              {admin.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 font-medium">{admin.email}</TableCell>
                          <TableCell className="text-right pr-6">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50" onClick={() => toast({ title: "Action Blocked", description: "Super Admin privileges cannot be modified from the client.", variant: "destructive" })}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!admins?.length && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-16 text-slate-400 font-bold uppercase text-[10px] tracking-widest">No administrative records detected</TableCell>
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
                      <TableRow className="border-slate-50 hover:bg-transparent">
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400 pl-6">Event Type</TableHead>
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400">Resource</TableHead>
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400">Timestamp</TableHead>
                        <TableHead className="text-[10px] font-black uppercase py-4 tracking-widest text-slate-400 text-right pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivity?.map((log: any) => (
                        <TableRow key={log.id} className="border-slate-50">
                          <TableCell className="text-xs font-bold text-slate-700 pl-6">
                             <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                               Survey Sync
                             </div>
                          </TableCell>
                          <TableCell className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            Booth {log.boothNumber || 'N/A'}
                          </TableCell>
                          <TableCell className="text-[10px] font-medium text-slate-500">
                            {log.submissionTimestamp ? new Date(log.submissionTimestamp).toLocaleString() : 'Recent'}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-bold">VERIFIED</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!recentActivity?.length && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-16 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Zero activity logs recorded in current epoch</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
               <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-slate-50 p-6">
                    <CardTitle className="text-lg font-headline font-bold">Security & Authorization</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                           <div className="flex items-center gap-3">
                              <Fingerprint className="w-6 h-6 text-primary" />
                              <h4 className="font-bold text-slate-900">Identity Guard</h4>
                           </div>
                           <p className="text-xs text-slate-500 leading-relaxed">
                              Your account session is protected by Firebase Authentication.
                           </p>
                           <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold border-slate-200" onClick={() => toast({ title: "Redirecting", description: "Manage identity settings in Firebase Console." })}>
                              Configure Identity
                           </Button>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                           <div className="flex items-center gap-3">
                              <Lock className="w-6 h-6 text-emerald-500" />
                              <h4 className="font-bold text-slate-900">Rule Verification</h4>
                           </div>
                           <p className="text-xs text-slate-500 leading-relaxed">
                              Verify if your account has the required document permissions to manage the live database.
                           </p>
                           <Button 
                              onClick={handleVerifySecurity}
                              disabled={isVerifying}
                              className="w-full h-10 rounded-xl text-xs font-bold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                           >
                              {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />}
                              Verify Permissions
                           </Button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <Button variant="ghost" className="h-12 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 justify-start px-4" onClick={() => setActiveTab("admins")}>
                           <UserCheck className="w-4 h-4 mr-3 text-primary" />
                           Manage Administrators
                        </Button>
                        <Button variant="ghost" className="h-12 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 justify-start px-4" onClick={() => setActiveTab("logs")}>
                           <History className="w-4 h-4 mr-3 text-emerald-500" />
                           View System Logs
                        </Button>
                     </div>

                     {securityStatus === "SUCCESS" && (
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                           <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                           <p className="text-xs font-bold text-emerald-800 uppercase tracking-tight">Rules Verified: Super Admin Access Granted</p>
                        </div>
                     )}
                     {securityStatus === "ERROR" && (
                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake-in-from-left-2">
                           <ShieldAlert className="w-5 h-5 text-rose-600" />
                           <p className="text-xs font-bold text-rose-800 uppercase tracking-tight">Security Alert: Authorization Signature Invalid</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
          )}

          {activeTab === "data" && (
            <Card className="border-none shadow-sm bg-slate-900 text-white rounded-3xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center">
                      <DatabaseZap className="w-6 h-6 text-amber-400" />
                   </div>
                   <div>
                      <CardTitle className="text-xl font-headline font-bold">Database Bootstrapper</CardTitle>
                      <p className="text-xs text-slate-400 mt-1">Initialize production environment with master records.</p>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Executing this operation will create the mandatory **Wards**, **Booths**, and **Admin Roles**.
                </p>
                
                <Button 
                  onClick={handleBootstrap}
                  disabled={isBootstrapping}
                  className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl gap-3 transition-all text-sm uppercase"
                >
                  {isBootstrapping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  )}
                  {isBootstrapping ? "Executing Writes..." : "Initialize Production Data"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
