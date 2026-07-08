"use client";

import { User } from "@/app/dashboard/users/page";
import DeleteUserModal from "./DeleteUserModal";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface UserRowProps {
  user: User;
  refreshUsers: () => void;
}

const roleMeta: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  admin:    { label: "Admin",    bg: "rgba(245,158,11,0.1)",  color: "#d97706", dot: "#f59e0b" },
  hr:       { label: "HR",       bg: "rgba(139,92,246,0.1)",  color: "#7c3aed", dot: "#8b5cf6" },
  employee: { label: "Employee", bg: "rgba(99,102,241,0.1)",  color: "#4f46e5", dot: "#6366f1" },
};

export default function UserRow({ user, refreshUsers }: UserRowProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [hovered, setHovered]       = useState(false);

  const role  = user.role?.toLowerCase() ?? "employee";
  const meta  = roleMeta[role] ?? roleMeta.employee;
  const initials = user.name?.slice(0, 2).toUpperCase() || "??";

  return (
    <>
      <tr
        className="transition-colors duration-100"
        style={{
          background: hovered ? "#fafbff" : "transparent",
          borderBottom: "1px solid #f0f2f8",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >

        {/* ── User ── */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${meta.dot}, ${meta.color})` }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
            </div>
          </div>
        </td>

        {/* ── Email ── */}
        <td className="hidden sm:table-cell px-5 py-3.5">
          <p className="text-slate-500 text-sm truncate max-w-[200px]">{user.email}</p>
        </td>

        {/* ── Role ── */}
        <td className="px-5 py-3.5">
          <span
            className="badge"
            style={{ background: meta.bg, color: meta.color, borderColor: meta.bg }}
          >
            <span className="badge-dot" style={{ background: meta.dot }} />
            {meta.label}
          </span>
        </td>

        {/* ── Department ── */}
        <td className="hidden md:table-cell px-5 py-3.5">
          {user.department ? (
            <p className="text-slate-500 text-sm">{user.department}</p>
          ) : (
            <span className="text-slate-300 text-sm">—</span>
          )}
        </td>

        {/* ── Employee ID ── */}
        <td className="hidden lg:table-cell px-5 py-3.5">
          {user.employeeId ? (
            <span
              className="text-xs font-mono px-2 py-1 rounded-md"
              style={{ background: "#f4f6fb", color: "#64748b", border: "1px solid #e8ecf4" }}
            >
              {user.employeeId}
            </span>
          ) : (
            <span className="text-slate-300 text-sm">—</span>
          )}
        </td>

        {/* ── Status ── */}
        <td className="hidden sm:table-cell px-5 py-3.5">
          <span
            className="badge"
            style={
              user.isActive
                ? { background: "rgba(16,185,129,0.08)", color: "#059669", borderColor: "rgba(16,185,129,0.15)" }
                : { background: "rgba(239,68,68,0.08)",  color: "#dc2626", borderColor: "rgba(239,68,68,0.15)" }
            }
          >
            <span
              className="badge-dot"
              style={{
                background: user.isActive ? "#10b981" : "#ef4444",
                boxShadow: user.isActive ? "0 0 0 2px rgba(16,185,129,0.25)" : "0 0 0 2px rgba(239,68,68,0.2)",
              }}
            />
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        {/* ── Actions ── */}
        <td className="px-5 py-3.5">
          <div className="flex items-center justify-center gap-1.5">
            <button
              title="Edit user"
              className="btn btn-icon cursor-pointer"
              style={{
                background: "rgba(99,102,241,0.08)",
                color: "#6366f1",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.16)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.08)";
              }}
            >
              <Pencil size={13} />
            </button>
            <button
              title="Delete user"
              onClick={() => setShowDelete(true)}
              className="btn btn-icon cursor-pointer"
              style={{
                background: "rgba(239,68,68,0.07)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.07)";
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </td>

      </tr>

      {showDelete && (
        <DeleteUserModal
          userId={user.id}
          userName={user.name}
          onClose={() => setShowDelete(false)}
          refreshUsers={refreshUsers}
        />
      )}
    </>
  );
}
