"use client";

import { cn } from "@/lib/utils";
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

interface SidebarProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

export function AppSidebar({ role, onRoleChange }: SidebarProps) {
  const navItems = {
    ADMIN: [
      { name: "Dashboard", icon: LayoutDashboard, href: "#" },
      { name: "Wards & Booths", icon: Map, href: "#" },
      { name: "Surveyors", icon: Users, href: "#" },
      { name: "Data Exports", icon: TrendingUp, href: "#" },
      { name: "Settings", icon: Settings, href: "#" },
    ],
    SURVEYOR: [
      { name: "New Survey", icon: ClipboardList, href: "#" },
      { name: "My Submissions", icon: LayoutDashboard, href: "#" },
      { name: "Profile", icon: UserCircle, href: "#" },
    ],
    CANDIDATE: [
      { name: "Ward Market", icon: Map, href: "#" },
      { name: "My Reports", icon: TrendingUp, href: "#" },
      { name: "Analysis", icon: LayoutDashboard, href: "#" },
    ],
  };

  const currentItems = navItems[role];

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r border-slate-100">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tight text-slate-900">
            WardWise <span className="text-primary">Pro</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.name === "Dashboard" || item.name === "New Survey" || item.name === "Ward Market"}
                    className="group"
                  >
                    <button className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.name === "Dashboard" && <ChevronRight className="w-3 h-3 opacity-50" />}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Role Selection
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-1">
              {(['ADMIN', 'SURVEYOR', 'CANDIDATE'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onRoleChange(r)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                    role === r 
                      ? "bg-primary text-white shadow-md shadow-primary/10" 
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()} Mode
                </button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-50">
        <div className="flex items-center gap-3 px-1 py-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px]">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-slate-900">John Doe</p>
            <p className="text-[10px] text-slate-400 truncate uppercase font-medium">{role}</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
