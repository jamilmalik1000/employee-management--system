"use client";

import { useEffect, useState } from "react";
import UserTable from "@/components/Users/UserTable";
import UserForm from "@/components/Users/UserForm";
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  isActive: boolean;
}

const normalizeUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role?.toLowerCase() || "employee",
  department: data.department || data.Department || "",
  employeeId: data.employeeId || data.employeeID || data.EmployeeID || "",
  isActive:
    data.isActive !== undefined ? data.isActive :
      data.IsActive !== undefined ? data.IsActive : true,
});

const statsMeta = [
  {
    key: "total",
    label: "Total Users",
    icon: Users,
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.15)",
    color: "#6366f1",
  },
  {
    key: "active",
    label: "Active",
    icon: UserCheck,
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.15)",
    color: "#10b981",
  },
  {
    key: "inactive",
    label: "Inactive",
    icon: UserX,
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.15)",
    color: "#ef4444",
  },
  {
    key: "admins",
    label: "Admins",
    icon: ShieldCheck,
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.15)",
    color: "#f59e0b",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/list");
      const data = await res.json();
      setUsers((Array.isArray(data) ? data : data.users || []).map(normalizeUser));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const statValues: Record<string, number> = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="page-root w-full max-w-none">

      {/* ── Page Header ── */}
      <div
        className="relative w-full overflow-hidden px-7 py-6 text-white p-10"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
        }}
      >
        {/* Decorative blob */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <p className="text-indigo-200 text-xs font-medium mb-1 flex items-center gap-1.5">
              <Users size={12} />
              User Management
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight">System Users</h1>
            <p className="text-indigo-200 text-sm mt-1">
              Create, manage, and control user access &amp; roles
            </p>
          </div>
          <div className="flex-shrink-0">
            <UserForm refreshUsers={fetchUsers} />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {statsMeta.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className="card px-5 py-5 flex items-center gap-4 hover:scale-[1.01] transition-transform duration-200 w-full"
            >
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <Icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight" style={{ color: s.color }}>
                  {loading ? (
                    <span className="skeleton inline-block w-8 h-7" />
                  ) : (
                    statValues[s.key]
                  )}
                </p>
                <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div className="w-full">
        <UserTable users={users} loading={loading} refreshUsers={fetchUsers} />
      </div>

    </div>
  );
}