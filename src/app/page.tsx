"use client";

import { useState, useEffect } from "react";
import { Role, User as AppUser } from "@/lib/types";
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { AppSidebar } from "@/components/shared/Sidebar";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { WardsBooths } from "@/components/admin/WardsBooths";
import { SurveyorsManagement } from "@/components/admin/SurveyorsManagement";
import { DataExports } from "@/components/admin/DataExports";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { SurveyorSubmissions } from "@/components/survey/SurveyorSubmissions";
import { SurveyorProfile } from "@/components/survey/SurveyorProfile";
import { CandidatePortal } from "@/components/candidate/CandidatePortal";
import { CandidateReports } from "@/components/candidate/CandidateReports";
import { CandidateAnalysisOverview } from "@/components/candidate/CandidateAnalysisOverview";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ShieldCheck, Loader2, AlertCircle, Play, Settings2, KeyRound, Info } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { user: firebaseUser, isUserLoading } = useUser();
  const db = useFirestore();
  const [activeView, setActiveView] = useState("");
  const [localUser, setLocalUser] = useState<AppUser | null>(null);

  // Memoize the user doc reference to avoid infinite loops in hooks
  const userDocRef = useMemoFirebase(() => {
    if (!db || !firebaseUser) return null;
    return doc(db, "users", firebaseUser.uid);
  }, [db, firebaseUser]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc<AppUser>(userDocRef);

  useEffect(() => {
    if (userData) {
      setLocalUser(userData);
      setDefaultView(userData.role);
    } else if (firebaseUser && !isUserDataLoading) {
      // Fallback for new users or if doc doesn't exist yet
      const defaultUser: AppUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.email?.split('@')[0] || "User",
        role: "SURVEYOR"
      };
      setLocalUser(defaultUser);
      setDefaultView("SURVEYOR");
    }
  }, [userData, firebaseUser, isUserDataLoading]);

  const setDefaultView = (role: Role) => {
    if (activeView !== "") return; // Don't override if already set
    if (role === "ADMIN") setActiveView("Dashboard");
    else if (role === "SURVEYOR") setActiveView("New Survey");
    else if (role === "CANDIDATE") setActiveView("Ward Market");
  };

  if (isUserLoading || (firebaseUser && isUserDataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing Intelligence</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (!localUser) return null;

    if (localUser.role === "ADMIN") {
      switch (activeView) {
        case "Dashboard": return <AdminDashboard />;
        case "Wards & Booths": return <WardsBooths />;
        case "Surveyors": return <SurveyorsManagement />;
        case "Data Exports": return <DataExports />;
        case "Settings": return <AdminSettings />;
        default: return <AdminDashboard />;
      }
    }

    if (localUser.role === "CANDIDATE") {
      switch (activeView) {
        case "Ward Market": return <CandidatePortal />;
        case "My Reports": return <CandidateReports />;
        case "Analysis": return <CandidateAnalysisOverview />;
        default: return <CandidatePortal />;
      }
    }

    if (localUser.role === "SURVEYOR") {
      switch (activeView) {
        case "New Survey": return <SurveyForm />;
        case "My Submissions": return <SurveyorSubmissions />;
        case "Profile": return <SurveyorProfile />;
        default: return <SurveyForm />;
      }
    }

    return null;
  };

  const handleRoleChange = (newRole: Role) => {
    if (localUser) {
      setLocalUser({ ...localUser, role: newRole });
      setDefaultView(newRole);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex bg-[#fcfcfd] min-h-screen w-full">
        <AppSidebar 
          role={localUser?.role || 'SURVEYOR'} 
          onRoleChange={handleRoleChange} 
          activeView={activeView}
          onViewChange={setActiveView}
          userName={localUser?.name || "User"}
        />
        
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 w-full shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white shadow-md sm:hidden">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-extrabold text-slate-900 tracking-tight sm:hidden">TRS Group</span>
                
                <div className="hidden sm:flex items-center gap-4 border-l pl-4 border-slate-100 ml-2">
                   <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Intel</span>
                    <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 border-emerald-100 text-emerald-600 bg-emerald-50">
                      LIVE HUB
                    </Badge>
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {localUser?.role === 'SURVEYOR' ? 'Field Collection Console' : 'Ward Analytics Hub'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Nominal</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs">
                {localUser?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
          
          <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-slate-50/30">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
