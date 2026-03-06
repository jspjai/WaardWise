"use client";

import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Map, 
  TrendingUp, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCircle
} from "lucide-react";
import { Role } from "@/lib/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  role: Role;
  activeView: string;
  onViewChange: (view: string) => void;
  userName: string;
}

export function AppSidebar({ role, activeView, onViewChange, userName }: SidebarProps) {
  const auth = useAuth();
  const { toast } = useToast();

  const navItems = {
    ADMIN: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "Wards & Booths", icon: Map },
      { name: "Surveyors", icon: Users },
      { name: "Data Exports", icon: TrendingUp },
      { name: "Settings", icon: Settings },
    ],
    SURVEYOR: [
      { name: "New Survey", icon: ClipboardList },
      { name: "My Submissions", icon: LayoutDashboard },
      { name: "Profile", icon: UserCircle },
    ],
    CANDIDATE: [
      { name: "Ward Market", icon: Map },
      { name: "My Reports", icon: TrendingUp },
      { name: "Analysis", icon: LayoutDashboard },
    ],
  };

  const currentItems = navItems[role] || [];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "Your session has been securely ended.",
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r border-slate-100 bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tight text-slate-900">
            TRS <span className="text-primary">Group</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    isActive={activeView === item.name}
                    className="group"
                    onClick={() => onViewChange(item.name)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {activeView === item.name && <ChevronRight className="w-3 h-3 opacity-50" />}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-50">
        <div className="flex items-center gap-3 px-1 py-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] uppercase">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-slate-900">{userName}</p>
            <p className="text-[10px] text-slate-400 truncate uppercase font-bold tracking-tight">{role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
