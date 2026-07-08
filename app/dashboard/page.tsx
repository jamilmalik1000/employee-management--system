"use client";

import { useAuth } from "@/Context/AuthContext";

const stats = [
  { label: "Total Employees", value: "—", icon: "👨‍💼", color: "text-blue-600",    bg: "bg-blue-50",   border: "border-blue-200" },
  { label: "Departments",     value: "—", icon: "🏢",   color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  { label: "On Leave Today",  value: "—", icon: "📅",   color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200" },
  { label: "Present Today",   value: "—", icon: "✅",   color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200" },
];

const quickLinks = [
  { label: "Manage Employees", href: "/dashboard/employees", icon: "👨‍💼", desc: "View and manage all employees" },
  { label: "Departments",      href: "/dashboard/departments", icon: "🏢", desc: "Organise your departments" },
  { label: "Attendance",       href: "/dashboard/attendence", icon: "📋", desc: "Track daily attendance" },
  { label: "Leave Requests",   href: "/dashboard/leaves",     icon: "📅", desc: "Review pending leave requests" },
];

export default function DashboardPage() {
  const { user, role } = useAuth();
  const name = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <div className="page-root">

      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white shadow-md">
        <p className="text-blue-100 text-sm font-medium mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-2xl font-bold">Welcome back, {name} 👋</h1>
        <p className="text-blue-200 text-sm mt-1 capitalize">
          Logged in as <span className="font-semibold text-white">{role}</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`card px-5 py-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center text-2xl flex-shrink-0`}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((q) => (
            <a
              key={q.label}
              href={q.href}
              className="card px-5 py-4 flex items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
            >
              <span className="text-2xl mt-0.5">{q.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {q.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{q.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Placeholder Activity */}
      <div className="card px-6 py-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
          <span className="text-4xl">📋</span>
          <p className="text-sm font-medium">No recent activity</p>
          <p className="text-xs">Activity will appear here once data is available.</p>
        </div>
      </div>

    </div>
  );
}
