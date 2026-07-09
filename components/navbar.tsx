"use client";

import { useAuth } from "@/Context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, LogOut } from "lucide-react";

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard":             { title: "Dashboard",      sub: "Welcome back — here's your overview" },
  "/dashboard/employees":   { title: "Employees",      sub: "Manage your workforce" },
  "/dashboard/departments": { title: "Departments",    sub: "Organise teams and departments" },
  "/dashboard/attendence":  { title: "Attendance",     sub: "Track daily attendance records" },
  "/dashboard/leaves":      { title: "Leave Requests", sub: "Review and manage leave requests" },
  "/dashboard/users":       { title: "Users",          sub: "Manage system users and roles" },
  "/dashboard/profile":     { title: "Profile",        sub: "Your account information" },
};

const roleMeta: Record<string, { color: string }> = {
  admin:    { color: "from-amber-500 to-orange-500" },
  hr:       { color: "from-violet-500 to-purple-600" },
  employee: { color: "from-indigo-500 to-blue-600" },
};

export default function Navbar() {
  const { user, logout, role } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  const handleLogout = () => { logout(); router.push("/login"); };

  const page        = pageTitles[pathname] ?? { title: "Dashboard", sub: "" };
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials    = displayName.slice(0, 2).toUpperCase();
  const roleLabel   = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Employee";
  const gradMeta    = roleMeta[role ?? "employee"] ?? roleMeta.employee;

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 z-30"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #e8ecf4",
        boxShadow: "0 1px 0 0 rgba(0,0,0,0.04)",
        paddingLeft: "1.5rem",
      }}
    >
      {/* Left — page title */}
      <div className="flex flex-col justify-center">
        <h1 className="text-base font-bold text-slate-900 leading-tight">{page.title}</h1>
        <p className="text-xs text-slate-400 leading-tight hidden sm:block">{page.sub}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Search pill */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 cursor-pointer transition-all duration-150"
          style={{ background: "#f4f6fb", border: "1px solid #e8ecf4" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#c7d2fe"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e8ecf4"; }}
        >
          <Search size={14} />
          <span className="text-xs pr-6">Search…</span>
          <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">⌘K</span>
        </button>

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer transition-colors border-none"
          style={{ background: "#f4f6fb", border: "1px solid #e8ecf4" }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#6366f1", boxShadow: "0 0 0 2px #fff" }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

        {/* User pill */}
        <div
          className="hidden sm:flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-default"
          style={{ background: "#f4f6fb", border: "1px solid #e8ecf4" }}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 bg-gradient-to-br ${gradMeta.color}`}
          >
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-slate-700 capitalize max-w-[120px] truncate">{displayName}</p>
            <p className="text-[10px] text-slate-400">{roleLabel}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 rounded-lg cursor-pointer transition-all duration-150 border-none"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.12)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)"; }}
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
}
