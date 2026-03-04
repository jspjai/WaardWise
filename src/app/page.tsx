"use client";

import { useState, useEffect } from "react";
import { Role, User } from "@/lib/types";
import { auth, db, hasValidConfig } from "@/lib/firebase";
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
import { ShieldCheck, Loader2, AlertCircle, PlayCircle } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // If no config and not in demo mode, stop loading to show error
    if (!hasValidConfig && !demoMode) {
      setLoading(false);
      return;
    }

    // If in demo mode, set a mock user
    if (demoMode) {
      const mockUser: User = {
        id: "demo-1",
        email: "demo@trsgroup.com",
        name: "Demo User",
        role: "ADMIN"
      };
      setUser(mockUser);
      setActiveView("Dashboard");
      setLoading(false);
      return;
    }

    // Standard Firebase Auth Flow
    if (auth && db) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              setUser(userData);
              if (userData.role === "ADMIN") setActiveView("Dashboard");
              else if (userData.role === "SURVEYOR") setActiveView("New Survey");
              else if (userData.role === "CANDIDATE") setActiveView("Ward Market");
            } else {
              const defaultUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.email?.split('@')[0] || "User",
                role: "SURVEYOR"
              };
              setUser(defaultUser);
              setActiveView("New Survey");
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
    }
  }, [demoMode]);

  const handleEnableDemo = () => {
    setLoading(true);
    setDemoMode(true);
  };

  if (!hasValidConfig && !demoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive" className="bg-white border-red-100 shadow-xl rounded-3xl p-6">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <AlertTitle className="font-headline font-extrabold text-slate-900 text-lg ml-2">Configuration Required</AlertTitle>
            <AlertDescription className="mt-4 text-slate-600 text-sm leading-relaxed ml-2">
              To use real Firebase Authentication and Databases, please add your API keys to the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-500 font-bold">.env</code> file.
            </AlertDescription>
          </Alert>
          
          <Card className="border-none shadow-lg bg-white rounded-3xl p-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Or explore the prototype</p>
            <Button 
              onClick={handleEnableDemo}
              className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Launch Demo Mode
            </Button>
            <p className="text-[10px] text-slate-400 mt-4 font-medium italic">Demo mode uses mock data and bypasses authentication.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Loading Intelligence Profile</p>
        </div>
      </div>
    );
  }

  if (!user && !demoMode) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (user?.role === "ADMIN") {
      switch (activeView) {
        case "Dashboard": return <AdminDashboard />;
        case "Wards & Booths": return <WardsBooths />;
        case "Surveyors": return <SurveyorsManagement />;
        case "Data Exports": return <DataExports />;
        case "Settings": return <AdminSettings />;
        default: return <AdminDashboard />;
      }
    }

    if (user?.role === "CANDIDATE") {
      switch (activeView) {
        case "Ward Market": return <CandidatePortal />;
        case "My Reports": return <CandidateReports />;
        case "Analysis": return <CandidateAnalysisOverview />;
        default: return <CandidatePortal />;
      }
    }

    if (user?.role === "SURVEYOR") {
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
    if (user) {
      setUser({ ...user, role: newRole });
      if (newRole === "ADMIN") setActiveView("Dashboard");
      if (newRole === "SURVEYOR") setActiveView("New Survey");
      if (newRole === "CANDIDATE") setActiveView("Ward Market");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex bg-[#fcfcfd] min-h-screen w-full">
        <AppSidebar 
          role={user?.role || "SURVEYOR"} 
          onRoleChange={handleRoleChange} 
          activeView={activeView}
          onViewChange={setActiveView}
          userName={user?.name || "Demo User"}
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
                      {user?.role === 'SURVEYOR' ? 'Field Collection Console' : 'Ward Analytics Hub'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {demoMode && (
                <div className="hidden md:flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">Demo Active</span>
                </div>
              )}
              <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Live Network</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {user?.name.charAt(0) || "D"}
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
