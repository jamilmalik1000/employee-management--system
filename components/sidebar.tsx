"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  UserCog,
  UserCircle,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const ALL_NAV_ITEMS = [
  { href: "/dashboard",             label: "Dashboard",      icon: LayoutDashboard, permission: "dashboard"   },
  { href: "/dashboard/employees",   label: "Employees",      icon: Users,           permission: "employees"   },
  { href: "/dashboard/departments", label: "Departments",    icon: Building2,       permission: "departments" },
  { href: "/dashboard/attendence",  label: "Attendance",     icon: CalendarCheck,   permission: "attendance"  },
  { href: "/dashboard/leaves",      label: "Leave Requests", icon: CalendarDays,    permission: "leaves"      },
  { href: "/dashboard/users",       label: "Users",          icon: UserCog,         permission: "users"       },
  { href: "/dashboard/roles",       label: "Roles",          icon: ShieldCheck,     permission: "roles"       },
  { href: "/dashboard/profile",     label: "Profile",        icon: UserCircle,      permission: "profile"     },
];

export default function Sidebar() {
  const { role, user, logout, permissions } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const navItems  = ALL_NAV_ITEMS.filter((item) => permissions.includes(item.permission));
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";
  const name      = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials  = name.slice(0, 2).toUpperCase();

  const handleLogout = () => { logout(); router.push("/login"); };

  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        background: "linear-gradient(180deg, #0f0f23 0%, #13132e 60%, #0f172a 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.375rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: "2.125rem", height: "2.125rem", borderRadius: "0.625rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 12px rgba(99,102,241,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.875rem", color: "#fff", flexShrink: 0 }}>
          E
        </div>
        <div style={{ lineHeight: 1.3 }}>
          <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#fff", margin: 0 }}>EMS</p>
          <p style={{ fontSize: "0.6875rem", color: "#4b5563", margin: 0 }}>Employee System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <p style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#374151", padding: "0 0.625rem", marginBottom: "0.5rem" }}>
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.625rem 0.75rem", borderRadius: "0.625rem",
                fontSize: "0.875rem", fontWeight: isActive ? 600 : 500,
                textDecoration: "none", transition: "all 0.15s",
                color: isActive ? "#fff" : "#9ca3af",
                background: isActive ? "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.12))" : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.28)" : "1px solid transparent",
              }}
            >
              <Icon size={16} style={{ flexShrink: 0, color: isActive ? "#a5b4fc" : "#6b7280" }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", background: "#818cf8", flexShrink: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.75rem", borderRadius: "0.625rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.6875rem", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f1f5f9", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textTransform: "capitalize" }}>{name}</p>
            <p style={{ fontSize: "0.6875rem", color: "#6b7280", margin: 0 }}>{roleLabel}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.75rem", borderRadius: "0.625rem", fontSize: "0.8125rem", fontWeight: 500, color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
