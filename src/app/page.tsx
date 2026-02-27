"use client";

import { useState } from "react";
import { Role } from "@/lib/types";
import { AppSidebar } from "@/components/shared/Sidebar";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { CandidatePortal } from "@/components/candidate/CandidatePortal";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const [role, setRole] = useState<Role>("ADMIN");

  const renderContent = () => {
    switch (role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "SURVEYOR":
        return <SurveyForm />;
      case "CANDIDATE":
        return <CandidatePortal />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex bg-[#fcfcfd] min-h-screen w-full">
        <AppSidebar role={role} onRoleChange={setRole} />
        
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 w-full shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Ward</span>
                <span className="text-sm font-bold text-slate-800">Indiranagar (Ward 80)</span>
              </div>
              <div className="sm:hidden flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800">Ward 80</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Live</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center md:hidden">
                <span className="text-[10px] font-bold text-slate-500">JD</span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
