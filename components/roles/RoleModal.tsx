"use client";

import { useEffect, useState } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { AVAILABLE_PERMISSIONS } from "@/lib/permission";
import { toast } from "sonner";
import { useDialog } from "@/hooks/useDialog";
import { getErrorMessage } from "@/lib/errors";

export interface Role {
  id: string;
  name: string;
  description?: string;
  Description?: string;
  permissions?: Record<string, boolean> | string[];
  Permissions?: Record<string, boolean> | string[];
  [key: string]: unknown;
}

interface Props {
  open: boolean;
  onClose: () => void;
  role?: Role | null;       // null = create mode, Role = edit mode
  refreshRoles: () => void;
}

const PERMISSION_GROUPS = [
  { group: "Core",       keys: ["dashboard", "profile"] },
  { group: "HR & People",keys: ["employees", "departments", "attendance", "leaves"] },
  { group: "System",     keys: ["users", "roles", "salary", "expenses", "settings"] },
];

export default function RoleModal({ open, onClose, role: editRole, refreshRoles }: Props) {
  const isEdit = !!editRole;
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const requestClose = () => {
    if (!loading) onClose();
  };
  const dialogRef = useDialog<HTMLDivElement>(open, requestClose);

  // Normalize permissions from API (object or array, any casing) → string[]
  function normalizePerms(role: Role): string[] {
    const raw = role.Permissions ?? role.permissions;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((k) => k.toLowerCase());
    return Object.entries(raw)
      .filter(([, v]) => v === true)
      .map(([k]) => k.toLowerCase());
  }

  // Populate form when editing
  useEffect(() => {
    if (editRole) {
      setName(editRole.name);
      setDescription((editRole.description ?? editRole.Description) || "");
      setPermissions(normalizePerms(editRole));
    } else {
      setName("");
      setDescription("");
      setPermissions([]);
    }
    setError("");
  }, [editRole, open]);

  if (!open) return null;

  const togglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const toggleGroup = (keys: string[]) => {
    const allSelected = keys.every((k) => permissions.includes(k));
    if (allSelected) {
      setPermissions((prev) => prev.filter((p) => !keys.includes(p)));
    } else {
      setPermissions((prev) => [...new Set([...prev, ...keys])]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Role name is required."); return; }
    if (permissions.length === 0) { setError("Select at least one permission."); return; }

    setLoading(true);
    setError("");

    try {
      const url    = isEdit ? "/api/roles/update" : "/api/roles/create";
      const method = isEdit ? "PUT" : "POST";

      // Build Permissions object with capitalized key to match Firestore schema
      const allKeys = PERMISSION_GROUPS.flatMap((g) => g.keys);
      const PermissionsObj: Record<string, boolean> = {};
      allKeys.forEach((k) => {
        const capitalized = k.charAt(0).toUpperCase() + k.slice(1);
        PermissionsObj[capitalized] = permissions.includes(k);
      });

      const body = isEdit
        ? { id: editRole!.id, name, description, Permissions: PermissionsObj }
        : { name, description, Permissions: PermissionsObj };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to save role.");
      }

      toast.success(isEdit ? `"${name}" role updated successfully!` : `"${name}" role created successfully!`);
      refreshRoles();
      onClose();
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save role.");
      setError(message);
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
        tabIndex={-1}
        className="animate-slideUp w-full overflow-y-auto"
        style={{
          maxWidth: "580px",
          maxHeight: "92vh",
          background: "#fff",
          borderRadius: "1.25rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            borderRadius: "1.25rem 1.25rem 0 0",
            padding: "1.75rem 2rem 1.5rem",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <div>
              <h2 id="role-modal-title" style={{ fontSize: "1.125rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                {isEdit ? "Edit Role" : "Create New Role"}
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#c4b5fd", margin: "0.25rem 0 0" }}>
                {isEdit ? "Update role name and permissions" : "Define a role and assign permissions"}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close role form"
            onClick={requestClose}
            disabled={loading}
            style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: loading ? "not-allowed" : "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd", opacity: loading ? 0.55 : 1 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} aria-describedby={error ? "role-form-error" : undefined} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Error */}
          {error && (
            <div id="role-form-error" role="alert" style={{ padding: "0.875rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="role-name" style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
              Role Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="role-name"
              type="text"
              placeholder="e.g. Manager, Accountant…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-invalid={!!error && !name.trim()}
              aria-describedby={error && !name.trim() ? "role-form-error" : undefined}
              style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "0.9375rem", border: "1.5px solid #e2e8f0", borderRadius: "0.75rem", outline: "none", fontFamily: "inherit", color: "#0f172a", background: "#f8faff", boxSizing: "border-box" }}
              onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="role-description" style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
              Description
            </label>
            <input
              id="role-description"
              type="text"
              placeholder="Short description of this role…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "0.9375rem", border: "1.5px solid #e2e8f0", borderRadius: "0.75rem", outline: "none", fontFamily: "inherit", color: "#0f172a", background: "#f8faff", boxSizing: "border-box" }}
              onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Permissions */}
          <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <legend style={{ width: "100%", padding: 0, marginBottom: "0.875rem" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Permissions <span style={{ color: "#ef4444" }}>*</span>
                </span>
                <span style={{ fontSize: "0.75rem", color: "#6366f1", fontWeight: 600 }}>
                  {permissions.length} / {AVAILABLE_PERMISSIONS.length} selected
                </span>
              </span>
            </legend>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {PERMISSION_GROUPS.map((group, groupIndex) => {
                const groupPerms = AVAILABLE_PERMISSIONS.filter((p) => group.keys.includes(p.key));
                const allChecked = group.keys.every((k) => permissions.includes(k));
                const someChecked = group.keys.some((k) => permissions.includes(k));

                return (
                  <div key={group.group} style={{ border: "1.5px solid #e8ecf4", borderRadius: "0.875rem", overflow: "hidden" }}>
                    {/* Group header */}
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "#f8faff", borderBottom: "1px solid #e8ecf4", cursor: "pointer" }}
                      onClick={() => toggleGroup(group.keys)}
                    >
                      <input
                        id={`role-permission-group-${groupIndex}`}
                        name="permissionGroups"
                        value={group.group}
                        aria-labelledby={`role-permission-group-${groupIndex}-label`}
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                        onChange={() => toggleGroup(group.keys)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "1rem", height: "1rem", accentColor: "#6366f1", cursor: "pointer" }}
                      />
                      <span id={`role-permission-group-${groupIndex}-label`} style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155" }}>{group.group}</span>
                    </div>

                    {/* Permission items */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                      {groupPerms.map((perm, idx) => {
                        const checked = permissions.includes(perm.key);
                        return (
                          <label
                            key={perm.key}
                            htmlFor={`role-permission-${perm.key}`}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.625rem",
                              padding: "0.75rem 1rem", cursor: "pointer",
                              background: checked ? "rgba(99,102,241,0.04)" : "#fff",
                              borderRight: idx % 2 === 0 ? "1px solid #f0f2f8" : "none",
                              borderBottom: idx < groupPerms.length - 2 ? "1px solid #f0f2f8" : "none",
                              transition: "background 0.1s",
                            }}
                          >
                            <input
                              id={`role-permission-${perm.key}`}
                              name="permissions"
                              value={perm.key}
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(perm.key)}
                              style={{ width: "1rem", height: "1rem", accentColor: "#6366f1", cursor: "pointer", flexShrink: 0 }}
                            />
                            <span style={{ fontSize: "0.875rem" }}>{perm.icon}</span>
                            <span style={{ fontSize: "0.875rem", fontWeight: checked ? 600 : 400, color: checked ? "#4f46e5" : "#475569" }}>
                              {perm.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {/* Divider */}
          <div style={{ height: "1px", background: "#f0f2f8" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={requestClose}
              disabled={loading}
              style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 600, borderRadius: "0.75rem", border: "1.5px solid #e2e8f0", background: "#f8faff", color: "#475569", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", background: loading ? "#818cf8" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", opacity: loading ? 0.75 : 1 }}
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : isEdit ? "Update Role" : "Create Role"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
