"use client";

import { Pencil, Trash2, ShieldCheck } from "lucide-react";
import { Role } from "./RoleModal";
import { AVAILABLE_PERMISSIONS } from "@/lib/permission";

interface Props {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

const permLabel = (key: string) =>
  AVAILABLE_PERMISSIONS.find((p) => p.key === key);

export default function RoleTable({ roles, loading, onEdit, onDelete }: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8ecf4", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

      {/* Table header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid #f0f2f8", background: "#fafbff" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>All Roles</h2>
        {!loading && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
            {roles.length} {roles.length === 1 ? "role" : "roles"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading roles…</p>
        </div>
      ) : roles.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <ShieldCheck size={48} color="#e2e8f0" />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>No roles yet</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>Click "Create Role" to define the first one.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8faff", borderBottom: "1px solid #f0f2f8" }}>
                {["Role", "Description", "Permissions", "Actions"].map((col) => (
                  <th
                    key={col}
                    style={{ padding: "0.875rem 1.5rem", textAlign: col === "Actions" ? "center" : "left", fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, i) => (
                <tr
                  key={role.id}
                  style={{ borderBottom: i < roles.length - 1 ? "1px solid #f0f2f8" : "none", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Role name */}
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldCheck size={14} color="#6366f1" />
                      </div>
                      <span style={{ fontWeight: 700, color: "#1e293b", textTransform: "capitalize" }}>{role.name}</span>
                    </div>
                  </td>

                  {/* Description */}
                  <td style={{ padding: "1rem 1.5rem", color: "#64748b", maxWidth: "200px" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {role.description || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </span>
                  </td>

                  {/* Permissions */}
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {(() => {
                      const perms = Array.isArray(role.permissions) ? role.permissions : [];
                      return (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                          {perms.slice(0, 5).map((key) => {
                            const p = permLabel(key);
                            return p ? (
                              <span
                                key={key}
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.625rem", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: "#4f46e5" }}
                              >
                                {p.icon} {p.label}
                              </span>
                            ) : null;
                          })}
                          {perms.length > 5 && (
                            <span style={{ padding: "0.2rem 0.625rem", background: "#f1f5f9", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>
                              +{perms.length - 5} more
                            </span>
                          )}
                          {perms.length === 0 && (
                            <span style={{ fontSize: "0.8125rem", color: "#cbd5e1" }}>No permissions</span>
                          )}
                        </div>
                      );
                    })()}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => onEdit(role)}
                        title="Edit role"
                        style={{ width: "2.125rem", height: "2.125rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.07)", color: "#6366f1", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.07)")}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(role)}
                        title="Delete role"
                        style={{ width: "2.125rem", height: "2.125rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.07)", color: "#ef4444", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.07)")}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
