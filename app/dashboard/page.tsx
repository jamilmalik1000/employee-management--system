"use client";

import { useAuth } from "@/Context/AuthContext";
import { Users, ShieldCheck, BarChart2, Clock } from "lucide-react";

const stats = [
  { label: "Total Employees", value: "—", icon: "👨‍💼", color: "#6366f1", bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.15)" },
  { label: "Departments",     value: "—", icon: "🏢",   color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.15)"  },
  { label: "On Leave Today",  value: "—", icon: "📅",   color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.15)"  },
  { label: "Present Today",   value: "—", icon: "✅",   color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.15)"  },
];

const quickLinks = [
  { label: "Manage Users",   href: "/dashboard/users",   icon: <Users size={18} color="#6366f1" />,      iconBg: "rgba(99,102,241,0.08)",  iconBorder: "rgba(99,102,241,0.15)", desc: "View and manage all users"         },
  { label: "Roles & Perms",  href: "/dashboard/roles",   icon: <ShieldCheck size={18} color="#059669" />, iconBg: "rgba(5,150,105,0.08)",   iconBorder: "rgba(5,150,105,0.15)",  desc: "Define roles and permissions"      },
  { label: "Attendance",     href: "/dashboard/attendance", icon: <BarChart2 size={18} color="#d97706" />, iconBg: "rgba(217,119,6,0.08)",   iconBorder: "rgba(217,119,6,0.15)",  desc: "Track daily attendance records"    },
  { label: "Leave Requests", href: "/dashboard/leaves",  icon: <Clock size={18} color="#dc2626" />,       iconBg: "rgba(220,38,38,0.08)",   iconBorder: "rgba(220,38,38,0.15)",  desc: "Review pending leave requests"     },
];

export default function DashboardPage() {
  const { user, role } = useAuth();
  const name = user?.displayName || user?.email?.split("@")[0] || "there";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="page-root">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>{today}</p>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#fff", border: "1px solid #e8ecf4", borderRadius: "0.75rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1e293b", margin: 0, lineHeight: 1.2 }}>{name}</p>
            <p style={{ fontSize: "0.6875rem", color: "#64748b", margin: 0, textTransform: "capitalize" }}>{role}</p>
          </div>
        </div>
      </div>

      {/* Welcome banner */}
      <div style={{ borderRadius: "1rem", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)", padding: "1.75rem 2rem", boxShadow: "0 4px 24px rgba(99,102,241,0.35)", position: "relative", overflow: "hidden" }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: "-2rem", right: "-2rem", width: "8rem", height: "8rem", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-1.5rem", right: "6rem", width: "5rem", height: "5rem", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, margin: "0 0 0.375rem" }}>Good to see you back 👋</p>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", margin: "0 0 0.375rem" }}>Welcome, {name}!</h2>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>
          Logged in as <span style={{ color: "#fff", fontWeight: 700, textTransform: "capitalize" }}>{role}</span>
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: "1.625rem", fontWeight: 800, color: s.color, lineHeight: 1, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div>
        <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.875rem" }}>
          Quick Access
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {quickLinks.map((q) => (
            <a
              key={q.label}
              href={q.href}
              style={{ textDecoration: "none" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
              }}
            >
              <div className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "0.875rem", transition: "transform 0.15s, box-shadow 0.15s" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: q.iconBg, border: `1.5px solid ${q.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {q.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e293b", margin: "0 0 0.25rem" }}>{q.label}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>{q.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8ecf4", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {/* Header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid #f0f2f8", background: "#fafbff" }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Recent Activity</h2>
          <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
            0 events
          </span>
        </div>
        {/* Empty state */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <span style={{ fontSize: "2.5rem" }}>📋</span>
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>No recent activity</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>Activity will appear here once data is available.</p>
        </div>
      </div>

    </div>
  );
}
