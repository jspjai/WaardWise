
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore, useMemoFirebase, useDoc, useAuth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { AppSidebar } from "@/components/shared/Sidebar";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { ViewerRequests } from "@/components/admin/ViewerRequests";
import { TicketsManagement } from "@/components/admin/TicketsManagement";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { SurveyorSubmissions } from "@/components/survey/SurveyorSubmissions";
import { ViewerDashboard } from "@/components/viewer/ViewerDashboard";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2, ShieldCheck, UserPlus, LogOut } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RequestAccessForm } from "@/components/public/RequestAccessForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";

export default function Home() {
  const { user: firebaseUser, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("");
  const [showPublicRequest, setShowPublicRequest] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const userDocRef = useMemoFirebase(() => (firebaseUser && db) ? doc(db, "users", firebaseUser.uid) : null, [db, firebaseUser]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (userData) {
      if (!activeView) {
        if (userData.role === "ADMIN") setActiveView("Dashboard");
        else if (userData.role === "SURVEYOR") setActiveView("New Survey");
        else if (userData.role === "VIEWER") setActiveView("Assigned Data");
      }
    }
  }, [userData, activeView]);

  const handlePromoteToAdmin = async () => {
    if (!firebaseUser || !db) return;
    setIsPromoting(true);
    try {
      await setDoc(doc(db, "users", firebaseUser.uid), {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.email === 'suryajai642@gmail.com' ? "Super Admin" : "User",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      });
      toast({ title: "Admin Role Authorized" });
    } catch (error: any) {
      toast({ title: "Promotion Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsPromoting(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    window.location.reload();
  };

  if (isUserLoading || (firebaseUser && isUserDataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!firebaseUser) {
    if (showPublicRequest) return <RequestAccessForm onBack={() => setShowPublicRequest(false)} />;
    return <LoginForm onShowRequest={() => setShowPublicRequest(true)} />;
  }

  if (!userData && !isUserDataLoading) {
    const isSuperAdmin = firebaseUser.email === 'suryajai642@gmail.com';
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center space-y-6">
          <ShieldCheck className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-xl font-bold">Unauthorized Access</h1>
          <p className="text-sm text-slate-500">Logged in as: <b>{firebaseUser.email}</b>. Your account has no role assigned.</p>
          {isSuperAdmin ? (
            <Button onClick={handlePromoteToAdmin} disabled={isPromoting} className="w-full h-12 rounded-xl">
              {isPromoting ? <Loader2 className="animate-spin mr-2" /> : <UserPlus className="mr-2" />}
              Initialize Super Admin
            </Button>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 p-4 rounded-xl">Please wait for an administrator to assign your role.</p>
          )}
          <Button variant="ghost" onClick={handleLogout} className="w-full text-red-500">Logout</Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!userData) return null;
    switch (activeView) {
      case "Dashboard": return <AdminDashboard />;
      case "User Management": return <UserManagement />;
      case "Viewer Requests": return <ViewerRequests />;
      case "Tickets": return <TicketsManagement />;
      case "New Survey": return <SurveyForm onNavigate={setActiveView} />;
      case "My Surveys": return <SurveyorSubmissions />;
      case "Assigned Data": return <ViewerDashboard />;
      default: return <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest">Select a view from the sidebar</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex bg-slate-50/50 min-h-screen w-full">
        <AppSidebar 
          role={userData?.role || 'VIEWER'} 
          activeView={activeView}
          onViewChange={setActiveView}
          userName={userData?.name || "User"}
        />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2 border-l pl-4">
                <Badge variant="outline" className="text-[10px] border-emerald-100 text-emerald-600 bg-emerald-50 uppercase font-black">Portal Live</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{userData?.email}</span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {userData?.name?.charAt(0)}
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto" key={activeView}>
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
