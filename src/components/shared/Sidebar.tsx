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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/types";

interface SidebarProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

export function AppSidebar({ role, onRoleChange }: SidebarProps) {
  const pathname = usePathname();

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

  return (
    <div className="w-64 border-r bg-white h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight text-slate-900">WardWise <span className="text-primary">Pro</span></span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <p className="px-3 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
          <nav className="space-y-1">
            {navItems[role].map((item) => (
              <button
                key={item.name}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  item.name === "Dashboard" || item.name === "New Survey" || item.name === "Ward Market"
                    ? "bg-primary/5 text-primary border-l-4 border-primary rounded-l-none"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-4 h-4", item.name === "Dashboard" || item.name === "New Survey" || item.name === "Ward Market" ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                  {item.name}
                </div>
                {item.name === "Dashboard" && <ChevronRight className="w-4 h-4 text-primary opacity-50" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t">
          <p className="px-3 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demo: Switch Role</p>
          <div className="space-y-2">
            {(['ADMIN', 'SURVEYOR', 'CANDIDATE'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-xs rounded transition-colors",
                  role === r ? "bg-primary text-white" : "hover:bg-slate-100 text-slate-500"
                )}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()} Mode
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-900">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">{role.toLowerCase()}@wardwise.pro</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
