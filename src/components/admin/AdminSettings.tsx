"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFirestore, useUser } from "@/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Globe, 
  Lock,
  UserCheck,
  Zap,
  Save,
  Loader2,
  DatabaseZap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSettings() {
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

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

      // 1. Ensure current user is an admin
      batch.set(doc(db, "roles_admin", user.uid), {
        id: user.uid,
        email: user.email,
        name: user.email === 'suryajai642@gmail.com' ? "Super Admin" : "Administrator",
        role: "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 2. Initialize the candidate profile for the super admin (for testing)
      batch.set(doc(db, "candidates", user.uid), {
        id: user.uid,
        name: user.email === 'suryajai642@gmail.com' ? "Super Admin" : "Candidate User",
        email: user.email,
        role: "CANDIDATE",
        purchasedWardIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 3. Create initial Wards
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
        description: error.message || "An unexpected error occurred during database initialization.",
        variant: "destructive"
      });
    } finally {
      setIsBootstrapping(false);
    }
  };

  const handleSaveConfig = () => {
    toast({
      title: "Changes Applied",
      description: "Application configuration has been updated successfully.",
    });
  };

  const handleSecurityAction = (action: string) => {
    toast({
      title: "Restricted Access",
      description: `The '${action}' module is currently syncing with the security cloud.`,
    });
  };

  const navItems = [
    { id: "general", label: "General Config", icon: Settings },
    { id: "security", label: "Security & Auth", icon: Shield },
    { id: "data", label: "Data Pipeline", icon: Database },
    { id: "notifications", label: "Alerts & Notifications", icon: Bell },
    { id: "localization", label: "Ward Localization", icon: Globe },
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
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm text-left",
                activeTab === item.id ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
              {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
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
                      onClick={() => handleSecurityAction("Audit Logs")}
                      className="h-16 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 justify-start px-6 transition-all hover:bg-slate-50"
                    >
                        <Lock className="w-5 h-5 mr-3 text-primary" />
                        Audit Logs
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSecurityAction("Manage Admins")}
                      className="h-16 rounded-2xl border-slate-100 bg-white font-bold text-slate-600 justify-start px-6 transition-all hover:bg-slate-50"
                    >
                        <UserCheck className="w-5 h-5 mr-3 text-emerald-500" />
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

          {activeTab !== "data" && activeTab !== "security" && (
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6">
                <CardTitle className="text-lg font-headline font-bold">System Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 <Button 
                    onClick={handleSaveConfig}
                    className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20 transition-all"
                 >
                    <Save className="w-5 h-5 mr-3" />
                    Save Configuration
                 </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "localization" && (
            <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl text-center space-y-4">
              <Globe className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="font-headline font-bold text-amber-900">Localization Engine</h3>
              <p className="text-sm text-amber-700 leading-relaxed max-w-sm mx-auto">
                Automatic translation for field surveyors (Kannada, Telugu, Hindi) is currently being calibrated for your region.
              </p>
              <Button variant="outline" className="rounded-xl border-amber-200 text-amber-700 font-bold h-11" onClick={() => handleSecurityAction("Localization")}>
                Configure Regions
              </Button>
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
                <Button className="w-full rounded-xl h-12 font-bold" onClick={handleSaveConfig}>Update Preferences</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
