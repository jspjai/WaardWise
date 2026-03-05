"use client";

import { useState, useEffect } from "react";
import { Role, User } from "@/lib/types";
import { auth, db, isConfigValid, missing } from "@/lib/firebase";
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
import { ShieldCheck, Loader2, AlertCircle, Play, Settings2, KeyRound } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!isConfigValid || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db!, "users", firebaseUser.uid));
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
        <div className="max-w-xl w-full space-y-6">
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-headline font-extrabold text-slate-900">TRS Intelligence</h1>
            <p className="text-slate-500 font-medium">Ward-Level Political Analysis Platform</p>
          </div>

          <Alert className="bg-white border-blue-100 shadow-xl rounded-3xl p-8 border-l-4 border-l-primary">
            <KeyRound className="h-6 w-6 text-primary" />
            <AlertTitle className="font-headline font-bold text-slate-900 text-lg ml-2">Configuration Required</AlertTitle>
            <AlertDescription className="mt-4 text-slate-600 text-sm leading-relaxed">
              We detected missing environment variables. To enable live data and authentication, please update your <code className="bg-slate-100 px-1.5 py-0.5 rounded text-primary font-bold">.env</code> file.
              
              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing Variables:</p>
                <div className="flex flex-wrap gap-2">
                  {missing.map(key => (
                    <Badge key={key} variant="outline" className="bg-red-50 text-red-600 border-red-100 font-mono text-[10px]">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setup Guide</p>
                <p className="text-sm text-slate-600 mt-1">Check the <span className="font-bold">README.md</span> for instructions on where to find these keys.</p>
              </div>
            </div>
            
            <button 
              onClick={launchDemo}
              className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 text-left transition-all hover:border-primary hover:shadow-md"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Preview</p>
                <p className="text-sm text-slate-600 mt-1 font-bold group-hover:text-primary transition-colors">Launch Demo Mode →</p>
              </div>
            </button>
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing Intelligence</p>
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
                    <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 border-emerald-100 text-emerald-600 bg-emerald-50">
                      LIVE HUB
                    </Badge>
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {user.role === 'SURVEYOR' ? 'Field Collection Console' : 'Ward Analytics Hub'}
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
                {user.name.charAt(0).toUpperCase()}
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
