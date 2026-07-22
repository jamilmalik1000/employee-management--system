"use client";

import { useAuth } from "@/Context/AuthContext";
import { Users, ShieldCheck, BarChart2, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

const stats = [
  { label: "Total Employees", value: "124", change: "+4 this month",  trend: "up",   icon: "👨💼", color: "var(--color-primary)", bg: "var(--color-primary-soft)", border: "rgba(var(--color-primary-rgb),0.18)" },
  { label: "Departments",     value: "9",   change: "No change",      trend: "flat", icon: "🏢",   color: "#8F6210", bg: "var(--color-gold-soft)", border: "rgba(var(--color-gold-rgb),0.3)"  },
  { label: "On Leave Today",  value: "7",   change: "+2 vs yesterday", trend: "up",  icon: "📅",   color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.15)"  },
  { label: "Present Today",   value: "101", change: "81% attendance", trend: "down", icon: "✅",   color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.15)"  },
];

const recentActivity = [
  { icon: "👤", text: "New employee Ali Hassan joined Engineering",      time: "2 min ago",  bg: "var(--color-primary-soft)"  },
  { icon: "📅", text: "Sara Khan submitted a leave request for 3 days", time: "18 min ago", bg: "var(--color-gold-soft)"   },
  { icon: "✏️", text: 'Role "HR Manager" permissions were updated',     time: "1 hr ago",   bg: "var(--color-accent-soft)"  },
  { icon: "✅", text: "Leave request approved for Omar Farooq",         time: "3 hrs ago",  bg: "rgba(5,150,105,0.08)"   },
  { icon: "🔐", text: "New user account created for Ayesha Malik",      time: "Yesterday",  bg: "rgba(37,99,235,0.08)"   },
  { icon: "🏢", text: 'Department "Finance" headcount updated to 14',   time: "Yesterday",  bg: "var(--color-gold-soft)"   },
];

const departments = [
  { name: "Engineering", count: 28, color: "var(--color-primary)", pct: 23 },
  { name: "Operations",  count: 22, color: "#2563eb", pct: 18 },
  { name: "Marketing",   count: 18, color: "var(--color-accent)", pct: 15 },
  { name: "Finance",     count: 14, color: "var(--color-gold)", pct: 11 },
  { name: "HR",          count: 12, color: "#7c3aed", pct: 10 },
  { name: "Others",      count: 30, color: "var(--color-text-muted)", pct: 23 },
];

const quickLinks = [
  { label: "Manage Users",   href: "/dashboard/users",      icon: <Users size={18} style={{ color: "var(--color-primary)" }} />,      iconBg: "var(--color-primary-soft)", iconBorder: "rgba(var(--color-primary-rgb),0.18)", desc: "View and manage all users"      },
  { label: "Roles & Perms",  href: "/dashboard/roles",      icon: <ShieldCheck size={18} color="#059669" />, iconBg: "rgba(5,150,105,0.08)",   iconBorder: "rgba(5,150,105,0.15)",  desc: "Define roles and permissions"   },
  { label: "Attendance",     href: "/dashboard/attendance", icon: <BarChart2 size={18} style={{ color: "var(--color-accent)" }} />,   iconBg: "var(--color-accent-soft)",   iconBorder: "rgba(var(--color-accent-rgb),0.2)",  desc: "Track daily attendance records" },
  { label: "Leave Requests", href: "/dashboard/leaves",     icon: <Clock size={18} color="#dc2626" />,       iconBg: "rgba(220,38,38,0.08)",   iconBorder: "rgba(220,38,38,0.15)",  desc: "Review pending leave requests"  },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")   return <TrendingUp size={12} />;
  if (trend === "down") return <TrendingDown size={12} />;
  return <Minus size={12} />;
}

export default function DashboardPage() {
  const { user, role } = useAuth();
  const name  = user?.displayName || user?.email?.split("@")[0] || "there";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="page-root">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--color-text-primary)", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>{today}</p>
        </div>
        <div className="card" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}>
          <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: "var(--gradient-identity)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.2 }}>{name}</p>
            <p style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary)", margin: 0, textTransform: "capitalize" }}>{role}</p>
          </div>
        </div>
      </div>

      {/* Welcome banner */}
      <div style={{ borderRadius: "1rem", background: "var(--gradient-brand)", padding: "1.75rem 2rem", boxShadow: "0 4px 24px rgba(var(--color-accent-rgb),0.35)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-2rem", right: "-2rem", width: "8rem", height: "8rem", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-1.5rem", right: "6rem", width: "5rem", height: "5rem", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.75)", fontWeight: 500, margin: "0 0 0.375rem" }}>Good to see you back 👋</p>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", margin: "0 0 0.375rem" }}>Welcome, {name}!</h2>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>
          Logged in as <span style={{ color: "#fff", fontWeight: 700, textTransform: "capitalize" }}>{role}</span>
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: "1.625rem", fontWeight: 800, color: s.color, lineHeight: 1, margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</p>
              </div>
            </div>
            <div style={{ marginTop: "0.875rem", display: "flex", alignItems: "center", gap: "0.375rem", color: s.trend === "up" ? "#dc2626" : s.trend === "down" ? "#059669" : "var(--color-text-muted)", fontSize: "0.75rem", fontWeight: 600 }}>
              <TrendIcon trend={s.trend} />
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Activity + Departments row */}
      <div className="dashboard-grid" style={{ display: "grid", gap: "1rem", alignItems: "start" }}>

        {/* Recent Activity */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface-alt)" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Recent Activity</h2>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", background: "var(--color-border)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
              {recentActivity.length} events
            </span>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", padding: "0.875rem 1.5rem", borderBottom: i < recentActivity.length - 1 ? "1px solid var(--color-bg-surface-alt)" : "none" }}>
                <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-primary)", fontWeight: 500, margin: 0, lineHeight: 1.4 }}>{a.text}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: "0.25rem 0 0" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "1.125rem 1.5rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface-alt)" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Departments</h2>
          </div>
          <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {departments.map((d) => (
              <div key={d.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-primary)" }}>{d.name}</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", fontWeight: 600 }}>{d.count}</span>
                </div>
                <div style={{ height: "6px", background: "var(--color-border)", borderRadius: "9999px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, borderRadius: "9999px", transition: "width 0.4s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Access */}
      <div>
        <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.875rem" }}>
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
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              <div className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "0.875rem", transition: "transform 0.15s, box-shadow 0.15s" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: q.iconBg, border: `1.5px solid ${q.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {q.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 0.25rem" }}>{q.label}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.4 }}>{q.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
