"use client";

import { useAuth } from "@/Context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Bell, LogOut, Menu } from "lucide-react";

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard":             { title: "Dashboard",        sub: "Welcome back — here's your overview"   },
  "/dashboard/employees":   { title: "Employees",        sub: "Manage your workforce"                 },
  "/dashboard/departments": { title: "Departments",      sub: "Organise teams and departments"        },
  "/dashboard/attendence":  { title: "Attendance",       sub: "Track daily attendance records"        },
  "/dashboard/leaves":      { title: "Leave Requests",   sub: "Review and manage leave requests"      },
  "/dashboard/users":       { title: "Users",            sub: "Manage system users and roles"         },
  "/dashboard/roles":       { title: "Roles",            sub: "Define roles and permissions"          },
  "/dashboard/profile":     { title: "Profile",          sub: "Your account information"              },
};

interface Props {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: Props) {
  const { user, logout, role } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  const handleLogout = () => { logout(); router.push("/login"); };

  const page        = pageTitles[pathname] ?? { title: "Dashboard", sub: "" };
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials    = displayName.slice(0, 2).toUpperCase();
  const roleLabel   = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Employee";

  return (
    <header
      style={{ height: "3.75rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #e8ecf4", boxShadow: "0 1px 0 0 rgba(0,0,0,0.04)", zIndex: 30, gap: "0.75rem" }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden"
          style={{ width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid #e8ecf4", background: "#f4f6fb", color: "#475569", cursor: "pointer", flexShrink: 0 }}
        >
          <Menu size={18} />
        </button>

        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{page.title}</h1>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} className="hidden sm:block">{page.sub}</p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>

        {/* Notification bell */}
        <button
          style={{ position: "relative", width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", background: "#f4f6fb", border: "1px solid #e8ecf4", color: "#64748b", cursor: "pointer" }}
        >
          <Bell size={16} />
          <span style={{ position: "absolute", top: "0.375rem", right: "0.375rem", width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 0 2px #fff" }} />
        </button>

        {/* Divider */}
        <div className="hidden sm:block" style={{ width: "1px", height: "1.5rem", background: "#e2e8f0" }} />

        {/* User pill — hidden on xs */}
        <div
          className="hidden sm:flex"
          style={{ alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.75rem", background: "#f4f6fb", border: "1px solid #e8ecf4", borderRadius: "0.75rem" }}
        >
          <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1e293b", margin: 0, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</p>
            <p style={{ fontSize: "0.6875rem", color: "#94a3b8", margin: 0, textTransform: "capitalize" }}>{roleLabel}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.75rem", fontSize: "0.8125rem", fontWeight: 600, color: "#ef4444", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "0.5rem", cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.12)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)"; }}
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
}
