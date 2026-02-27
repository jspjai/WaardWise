"use client";

import { useState } from "react";
import { Role } from "@/lib/types";
import { AppSidebar } from "@/components/shared/Sidebar";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { CandidatePortal } from "@/components/candidate/CandidatePortal";

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
    <div className="flex bg-[#fcfcfd] min-h-screen">
      <AppSidebar role={role} onRoleChange={setRole} />
      <main className="flex-1 overflow-x-hidden">
        {/* Top Header Placeholder */}
        <div className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Ward</span>
            <span className="text-sm font-bold text-slate-800">Indiranagar (Ward 80)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 px-3 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">System Online</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
