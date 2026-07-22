"use client";

import { Pencil, Trash2, Users } from "lucide-react";
import { User } from "@/app/dashboard/users/page";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import ActionsMenu from "@/components/ActionsMenu";

interface Props {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const roleMeta: Record<string, { color: string; bg: string; border: string }> = {
  admin:    { color: "var(--status-danger-text)", bg: "rgba(220,38,38,0.1)",   border: "rgba(220,38,38,0.22)"   },
  hr:       { color: "var(--status-info-text)", bg: "rgba(37,99,235,0.1)",   border: "rgba(37,99,235,0.22)"   },
  employee: { color: "var(--status-success-text)", bg: "rgba(5,150,105,0.1)",   border: "rgba(5,150,105,0.22)"   },
};

const defaultMeta = { color: "#6366f1", bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.15)" };

export default function UserTable({ users, loading, onEdit, onDelete, emptyTitle = "No users yet", emptyDescription = 'Click "Add User" to create the first one.' }: Props) {
  const pagination = usePagination(users);
  return (
    <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8ecf4", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid #f0f2f8", background: "#fafbff" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>All Users</h2>
        {!loading && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
            {users.length} {users.length === 1 ? "user" : "users"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading users…</p>
        </div>
      ) : users.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <Users size={48} color="#e2e8f0" />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>{emptyTitle}</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>{emptyDescription}</p>
        </div>
      ) : (
        <div className="table-scroll-region" role="region" aria-label="Users table, scroll horizontally for more columns" tabIndex={0} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "640px" }}>
            <thead>
              <tr style={{ background: "#f8faff", borderBottom: "1px solid #f0f2f8" }}>
                {[
                  { label: "Employee ID", hide: "sm" },
                  { label: "Name",        hide: ""   },
                  { label: "Email",       hide: "md" },
                  { label: "Role",        hide: ""   },
                  { label: "Department",  hide: "lg" },
                  { label: "Status",      hide: "sm" },
                  { label: "Actions",     hide: ""   },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={col.hide ? `hidden ${col.hide}:table-cell` : ""}
                    style={{ padding: "0.875rem 1rem", textAlign: col.label === "Actions" ? "center" : "left", fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagination.pageItems.map((user, i) => {
                const role = (user.role || "employee").toLowerCase();
                const meta = roleMeta[role] ?? defaultMeta;
                const isActive = user.isActive ?? false;

                return (
                  <tr
                    key={user.id}
                    style={{ borderBottom: i < users.length - 1 ? "1px solid #f0f2f8" : "none", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Employee ID */}
                    <td className="hidden sm:table-cell" style={{ padding: "0.875rem 1rem", fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>
                      {user.employeeId || "—"}
                    </td>

                    {/* Name */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: "#6366f1" }}>
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="hidden md:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </td>

                    {/* Role badge */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: meta.color, textTransform: "capitalize", whiteSpace: "nowrap" }}>
                        {role}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="hidden lg:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                      {user.department || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>

                    {/* Status badge */}
                    <td className="hidden sm:table-cell" style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", background: isActive ? "rgba(5,150,105,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${isActive ? "rgba(5,150,105,0.22)" : "rgba(239,68,68,0.22)"}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: isActive ? "var(--status-success-text)" : "var(--status-danger-text)", whiteSpace: "nowrap" }}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                      <div className="flex justify-center"><ActionsMenu details={{ title: user.name || user.email || "User", data: user }} items={[{ label: "Edit", icon: Pencil, onClick: () => onEdit(user) }, { label: "Delete", icon: Trash2, danger: true, onClick: () => onDelete(user) }]} /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && users.length > 0 && <Pagination {...pagination} total={users.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />}
    </div>
  );
}
