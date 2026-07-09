"use client";

import { useState } from "react";
import { Pencil, Trash2, ShieldCheck, X } from "lucide-react";
import { Role } from "./RoleModal";

interface Props {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

// Normalize: handles object {Dashboard:true,...} or array ["dashboard",...]
// Returns only the enabled permission keys (lowercased)
function getEnabledPerms(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((k) => String(k).toLowerCase());
  if (typeof raw === "object") {
    return Object.entries(raw as Record<string, boolean>)
      .filter(([, v]) => v === true)
      .map(([k]) => k.toLowerCase());
  }
  return [];
}

// Resolve permissions field regardless of casing (permissions / Permissions)
function resolvePerms(role: Role): string[] {
  const r = role as Record<string, unknown>;
  const raw = r["permissions"] ?? r["Permissions"] ?? null;
  return getEnabledPerms(raw);
}

// Icon map for known permission keys
const PERM_META: Record<string, { icon: string; label: string; color: string; bg: string; border: string }> = {
  dashboard:   { icon: "📊", label: "Dashboard",     color: "#6366f1", bg: "rgba(99,102,241,0.07)",  border: "rgba(99,102,241,0.15)"  },
  users:       { icon: "👥", label: "Users",          color: "#2563eb", bg: "rgba(37,99,235,0.07)",   border: "rgba(37,99,235,0.15)"   },
  employees:   { icon: "👨‍💼", label: "Employees",     color: "#059669", bg: "rgba(5,150,105,0.07)",   border: "rgba(5,150,105,0.15)"   },
  departments: { icon: "🏢", label: "Departments",    color: "#d97706", bg: "rgba(217,119,6,0.07)",   border: "rgba(217,119,6,0.15)"   },
  attendance:  { icon: "📋", label: "Attendance",     color: "#0891b2", bg: "rgba(8,145,178,0.07)",   border: "rgba(8,145,178,0.15)"   },
  leaves:      { icon: "📅", label: "Leave Requests", color: "#7c3aed", bg: "rgba(124,58,237,0.07)",  border: "rgba(124,58,237,0.15)"  },
  roles:       { icon: "🛡️", label: "Roles",          color: "#dc2626", bg: "rgba(220,38,38,0.07)",   border: "rgba(220,38,38,0.15)"   },
  reports:     { icon: "📈", label: "Reports",        color: "#0d9488", bg: "rgba(13,148,136,0.07)",  border: "rgba(13,148,136,0.15)"  },
  settings:    { icon: "⚙️", label: "Settings",       color: "#64748b", bg: "rgba(100,116,139,0.07)", border: "rgba(100,116,139,0.15)" },
  profile:     { icon: "👤", label: "Profile",        color: "#9333ea", bg: "rgba(147,51,234,0.07)",  border: "rgba(147,51,234,0.15)"  },
};

function permMeta(key: string) {
  return PERM_META[key] ?? { icon: "🔑", label: key.charAt(0).toUpperCase() + key.slice(1), color: "#6366f1", bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.15)" };
}

// ── Permissions Detail Modal ──────────────────────────────────────────────────
function PermissionsModal({ role, onClose }: { role: Role; onClose: () => void }) {
  const enabled = resolvePerms(role);

  // Also collect disabled ones from the raw object for full picture
  const r = role as Record<string, unknown>;
  const raw = (r["permissions"] ?? r["Permissions"]) as Record<string, boolean> | null;
  const allKeys: string[] = raw
    ? Object.keys(raw).map((k) => k.toLowerCase())
    : enabled;
  const disabled = allKeys.filter((k) => !enabled.includes(k));

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: "1rem" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: "1.25rem", width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden", animation: "slideUp 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={16} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.7)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Permissions</p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", margin: 0, textTransform: "capitalize" }}>{role.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>

          {/* Enabled */}
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
            Granted · {enabled.length}
          </p>
          {enabled.length === 0 ? (
            <p style={{ fontSize: "0.8125rem", color: "#cbd5e1", marginBottom: "1.25rem" }}>No permissions granted.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {enabled.map((key) => {
                const m = permMeta(key);
                return (
                  <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.35rem 0.75rem", background: m.bg, border: `1px solid ${m.border}`, borderRadius: "9999px", fontSize: "0.8125rem", fontWeight: 600, color: m.color }}>
                    {m.icon} {m.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Disabled */}
          {disabled.length > 0 && (
            <>
              <div style={{ height: "1px", background: "#f0f2f8", marginBottom: "1.25rem" }} />
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
                Restricted · {disabled.length}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {disabled.map((key) => {
                  const m = permMeta(key);
                  return (
                    <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.35rem 0.75rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "9999px", fontSize: "0.8125rem", fontWeight: 600, color: "#94a3b8", textDecoration: "line-through" }}>
                      {m.icon} {m.label}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f0f2f8", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ padding: "0.6rem 1.5rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── RoleTable ─────────────────────────────────────────────────────────────────
const MAX_VISIBLE = 3;

export default function RoleTable({ roles, loading, onEdit, onDelete }: Props) {
  const [viewRole, setViewRole] = useState<Role | null>(null);

  return (
    <>
      <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8ecf4", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Header bar */}
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
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "520px" }}>
              <thead>
                <tr style={{ background: "#f8faff", borderBottom: "1px solid #f0f2f8" }}>
                  {[
                    { label: "Role",        hide: "" },
                    { label: "Description", hide: "md" },
                    { label: "Permissions", hide: "" },
                    { label: "Actions",     hide: "" },
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
                {roles.map((role, i) => {
                  const enabled = resolvePerms(role);
                  const isAdmin = role.name?.toLowerCase() === "admin";

                  return (
                    <tr
                      key={role.id}
                      style={{ borderBottom: i < roles.length - 1 ? "1px solid #f0f2f8" : "none", transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Role name */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ShieldCheck size={14} color="#6366f1" />
                          </div>
                          <span style={{ fontWeight: 700, color: "#1e293b", textTransform: "capitalize" }}>{role.name}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="hidden md:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", maxWidth: "180px" }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                          {(role as Record<string, unknown>)["description"] as string ||
                           (role as Record<string, unknown>)["Description"] as string ||
                           <span style={{ color: "#cbd5e1" }}>—</span>}
                        </span>
                      </td>

                      {/* Permissions */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        {enabled.length === 0 ? (
                          <span style={{ fontSize: "0.8125rem", color: "#cbd5e1" }}>No permissions</span>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", alignItems: "center" }}>
                            {enabled.slice(0, MAX_VISIBLE).map((key) => {
                              const m = permMeta(key);
                              return (
                                <span
                                  key={key}
                                  style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.625rem", background: m.bg, border: `1px solid ${m.border}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: m.color }}
                                >
                                  {m.icon} {m.label}
                                </span>
                              );
                            })}
                            {enabled.length > MAX_VISIBLE && (
                              <button
                                onClick={() => setViewRole(role)}
                                style={{ padding: "0.2rem 0.625rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: "#6366f1", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                              >
                                +{enabled.length - MAX_VISIBLE} more
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                          <button
                            onClick={() => !isAdmin && onEdit(role)}
                            title={isAdmin ? "Admin role cannot be edited" : "Edit role"}
                            disabled={isAdmin}
                            style={{ width: "2.125rem", height: "2.125rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.07)", color: isAdmin ? "#c7d2fe" : "#6366f1", cursor: isAdmin ? "not-allowed" : "pointer", opacity: isAdmin ? 0.45 : 1 }}
                            onMouseEnter={(e) => { if (!isAdmin) e.currentTarget.style.background = "rgba(99,102,241,0.15)"; }}
                            onMouseLeave={(e) => { if (!isAdmin) e.currentTarget.style.background = "rgba(99,102,241,0.07)"; }}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => !isAdmin && onDelete(role)}
                            title={isAdmin ? "Admin role cannot be deleted" : "Delete role"}
                            disabled={isAdmin}
                            style={{ width: "2.125rem", height: "2.125rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.07)", color: isAdmin ? "#fca5a5" : "#ef4444", cursor: isAdmin ? "not-allowed" : "pointer", opacity: isAdmin ? 0.45 : 1 }}
                            onMouseEnter={(e) => { if (!isAdmin) e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                            onMouseLeave={(e) => { if (!isAdmin) e.currentTarget.style.background = "rgba(239,68,68,0.07)"; }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permissions detail modal */}
      {viewRole && <PermissionsModal role={viewRole} onClose={() => setViewRole(null)} />}
    </>
  );
}
