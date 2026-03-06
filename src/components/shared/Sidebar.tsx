
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
  UserCircle,
  FileText,
  Key
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      { name: "User Management", icon: Users },
      { name: "Viewer Requests", icon: Key },
      { name: "Wards & Booths", icon: Map },
    ],
    SURVEYOR: [
      { name: "New Survey", icon: ClipboardList },
      { name: "My Surveys", icon: LayoutDashboard },
    ],
    VIEWER: [
      { name: "Assigned Data", icon: FileText },
    ],
  };

  const currentItems = navItems[role] || [];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out Successfully" });
      window.location.reload();
    } catch (error: any) {
      toast({ title: "Logout Error", variant: "destructive" });
    }
  };

  return (
    <Sidebar variant="sidebar" className="border-r border-slate-100 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">TRS Portal</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {currentItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton isActive={activeView === item.name} onClick={() => onViewChange(item.name)} className="h-11 rounded-xl px-4">
                    <item.icon className="w-4 h-4 mr-2" />
                    <span className="font-bold text-sm">{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">{userName.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{userName}</p>
            <Badge className="bg-slate-100 text-slate-500 text-[9px] uppercase font-black tracking-widest border-none px-2">{role}</Badge>
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 h-11 rounded-xl hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          <span className="font-bold">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
