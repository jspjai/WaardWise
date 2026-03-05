"use client";

import { useState, useEffect } from "react";
import { Role, User } from "@/lib/types";
import { auth, db, isConfigValid } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
import { ShieldCheck, Loader2, AlertCircle, Play } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // If Firebase isn't configured or we're on the server, just stop loading
    if (!isConfigValid || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            setDefaultView(userData.role);
          } else {
            const defaultUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.email?.split('@')[0] || "User",
              role: "SURVEYOR"
            };
            setUser(defaultUser);
            setDefaultView("SURVEYOR");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setDefaultView = (role: Role) => {
    if (role === "ADMIN") setActiveView("Dashboard");
    else if (role === "SURVEYOR") setActiveView("New Survey");
    else if (role === "CANDIDATE") setActiveView("Ward Market");
  };

  const launchDemo = () => {
    setDemoMode(true);
    setUser({
      id: "demo-user",
      name: "Demo Analyst",
      email: "demo@trsgroup.com",
      role: "ADMIN"
    });
    setActiveView("Dashboard");
  };

  if (!isConfigValid && !demoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full space-y-4">
          <Alert className="bg-white border-blue-100 shadow-xl rounded-2xl p-6">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline font-bold text-slate-900">TRS Group Intelligence</AlertTitle>
            <AlertDescription className="mt-2 text-slate-600 text-sm leading-relaxed">
              Your environment keys are detected. To finalize the connection, please ensure your **Firebase Project Settings** have an active Web App and Authorized Domains.
            </AlertDescription>
          </Alert>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prototype Preview</p>
            <p className="text-sm text-slate-600">Want to explore the interface while your connection initializes?</p>
            <Button onClick={launchDemo} className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl font-bold gap-2">
              <Play className="w-4 h-4" />
              Launch Demo Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authenticating Portal</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (user.role === "ADMIN") {
      switch (activeView) {
        case "Dashboard": return <AdminDashboard />;
        case "Wards & Booths": return <WardsBooths />;
        case "Surveyors": return <SurveyorsManagement />;
        case "Data Exports": return <DataExports />;
        case "Settings": return <AdminSettings />;
        default: return <AdminDashboard />;
      }
    }

    if (user.role === "CANDIDATE") {
      switch (activeView) {
        case "Ward Market": return <CandidatePortal />;
        case "My Reports": return <CandidateReports />;
        case "Analysis": return <CandidateAnalysisOverview />;
        default: return <CandidatePortal />;
      }
    }

    if (user.role === "SURVEYOR") {
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
    setUser({ ...user, role: newRole });
    setDefaultView(newRole);
  };

  return (
    <SidebarProvider>
      <div className="flex bg-[#fcfcfd] min-h-screen w-full">
        <AppSidebar 
          role={user.role} 
          onRoleChange={handleRoleChange} 
          activeView={activeView}
          onViewChange={setActiveView}
          userName={user.name}
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
                    <span className="text-xs font-bold text-slate-700">
                      {user.role === 'SURVEYOR' ? 'Field Collection Console' : 'Ward Analytics Hub'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Live Network</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {user.name.charAt(0)}
                </span>
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
