
"use client";

import { useState, useEffect } from "react";
import { Role } from "@/lib/types";
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
import { ShieldCheck, Loader2, AlertCircle, Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user: firebaseUser, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("");
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState("User");
  const [isPromoting, setIsPromoting] = useState(false);

  const adminDocRef = useMemoFirebase(() => firebaseUser ? doc(db, "roles_admin", firebaseUser.uid) : null, [db, firebaseUser]);
  const surveyorDocRef = useMemoFirebase(() => firebaseUser ? doc(db, "surveyors", firebaseUser.uid) : null, [db, firebaseUser]);
  const candidateDocRef = useMemoFirebase(() => firebaseUser ? doc(db, "candidates", firebaseUser.uid) : null, [db, firebaseUser]);

  const { data: adminData, isLoading: isAdminLoading } = useDoc(adminDocRef);
  const { data: surveyorData, isLoading: isSurveyorLoading } = useDoc(surveyorDocRef);
  const { data: candidateData, isLoading: isCandidateLoading } = useDoc(candidateDocRef);

  useEffect(() => {
    if (adminData) {
      setUserRole("ADMIN");
      setUserName("Administrator");
      if (!activeView) setActiveView("Dashboard");
    } else if (surveyorData) {
      setUserRole("SURVEYOR");
      setUserName(surveyorData.name || "Surveyor");
      if (!activeView) setActiveView("New Survey");
    } else if (candidateData) {
      setUserRole("CANDIDATE");
      setUserName(candidateData.name || "Candidate");
      if (!activeView) setActiveView("Ward Market");
    }
  }, [adminData, surveyorData, candidateData, activeView]);

  const handlePromoteToAdmin = async () => {
    if (!firebaseUser || !db) return;
    setIsPromoting(true);
    try {
      await setDoc(doc(db, "roles_admin", firebaseUser.uid), {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: "Administrator",
        role: "ADMIN",
        createdAt: new Date().toISOString()
      });
      toast({
        title: "Admin Role Assigned",
        description: "Your account has been promoted to Admin. Refreshing...",
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Promotion Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsPromoting(false);
    }
  };

  if (isUserLoading || (firebaseUser && (isAdminLoading && isSurveyorLoading && isCandidateLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authenticating Portal</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginForm />;
  }

  // Handle users who are logged in but have no role defined yet in Firestore
  if (!userRole && !isAdminLoading && !isSurveyorLoading && !isCandidateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center">
        <div className="max-w-md space-y-6 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-headline font-extrabold text-slate-900">Account Pending Assignment</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your account ({firebaseUser.email}) is active, but hasn't been assigned a system role (Admin, Surveyor, or Candidate).
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handlePromoteToAdmin} 
              disabled={isPromoting}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 font-bold shadow-lg shadow-primary/20 gap-2"
            >
              {isPromoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
              Initialize Admin Account
            </Button>
            <Button variant="ghost" onClick={() => { window.location.reload(); }} className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Refresh Status
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (userRole === "ADMIN") {
      switch (activeView) {
        case "Dashboard": return <AdminDashboard />;
        case "Wards & Booths": return <WardsBooths />;
        case "Surveyors": return <SurveyorsManagement />;
        case "Data Exports": return <DataExports />;
        case "Settings": return <AdminSettings />;
        default: return <AdminDashboard />;
      }
    }

    if (userRole === "CANDIDATE") {
      switch (activeView) {
        case "Ward Market": return <CandidatePortal />;
        case "My Reports": return <CandidateReports />;
        case "Analysis": return <CandidateAnalysisOverview />;
        default: return <CandidatePortal />;
      }
    }

    if (userRole === "SURVEYOR") {
      switch (activeView) {
        case "New Survey": return <SurveyForm />;
        case "My Submissions": return <SurveyorSubmissions />;
        case "Profile": return <SurveyorProfile />;
        default: return <SurveyForm />;
      }
    }

    return null;
  };

  return (
    <SidebarProvider>
      <div className="flex bg-[#fcfcfd] min-h-screen w-full">
        <AppSidebar 
          role={userRole || 'ADMIN'} 
          activeView={activeView}
          onViewChange={setActiveView}
          userName={userName}
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
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Secure Connection</span>
                    <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 border-emerald-100 text-emerald-600 bg-emerald-50">
                      LIVE
                    </Badge>
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
                {userName.charAt(0).toUpperCase()}
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
