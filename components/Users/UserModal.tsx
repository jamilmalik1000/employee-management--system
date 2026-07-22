"use client";

import { useEffect, useState } from "react";
import {
  X, Plus, User, Mail, Lock, Building2, BadgeCheck,
  ChevronDown, ShieldCheck, AlertCircle, Loader2, ToggleLeft, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { User as UserType } from "@/app/dashboard/users/page";
import { Role } from "@/components/roles/RoleModal";
import RoleModal from "@/components/roles/RoleModal";

interface Props {
  open: boolean;
  onClose: () => void;
  user: UserType;
  refreshUsers: () => void;
}

/* ── shared style constants ── */
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.6875rem", fontWeight: 700,
  color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase",
  marginBottom: "0.5rem",
};
const inputWrap: React.CSSProperties = { position: "relative" };
const iconStyle: React.CSSProperties = {
  position: "absolute", left: "0.875rem", top: "50%",
  transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8",
};
const inputBase: React.CSSProperties = {
  width: "100%", padding: "0.75rem 0.875rem 0.75rem 2.5rem",
  fontSize: "0.875rem", fontFamily: "inherit", background: "#f8faff",
  border: "1.5px solid #e2e8f0", borderRadius: "0.625rem",
  color: "#0f172a", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box" as const,
};
const focusIn  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "#6366f1";
  e.target.style.boxShadow   = "0 0 0 3px rgba(99,102,241,0.12)";
  e.target.style.background  = "#fff";
};
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "#e2e8f0";
  e.target.style.boxShadow   = "none";
  e.target.style.background  = "#f8faff";
};

export default function UserModal({ open, onClose, user, refreshUsers }: Props) {
  const isEdit = !!user.id;

  const [form, setForm]       = useState<UserType>(user);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  /* roles */
  const [roles, setRoles]               = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  /* sync form when user prop changes (open/edit different user) */
  useEffect(() => {
    setForm(user);
    setPassword("");
    setShowPassword(false);
    setError("");
  }, [user]);

  /* fetch roles whenever modal opens */
  useEffect(() => {
    if (!open) return;
    setRolesLoading(true);
    fetch("/api/roles/list")
      .then((r) => r.json())
      .then((data) => {
        const list: Role[] = Array.isArray(data) ? data : [];
        setRoles(list);
        /* if current role value isn't in the list yet, keep it; otherwise fine */
      })
      .catch(() => {})
      .finally(() => setRolesLoading(false));
  }, [open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRoleCreated = async () => {
    /* re-fetch roles then close the nested modal */
    const res  = await fetch("/api/roles/list");
    const data = await res.json();
    const list: Role[] = Array.isArray(data) ? data : [];
    setRoles(list);
    setRoleModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role) { setError("Please select a role."); return; }
    setLoading(true);
    setError("");
    try {
      const url    = isEdit ? "/api/users/update" : "/api/users/create";
      const method = isEdit ? "PUT" : "POST";
      const body   = isEdit
        ? { uid: form.id, ...form, ...(password ? { password } : {}) }
        : { ...form, password };

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save user.");
      toast.success(isEdit ? "User updated successfully!" : "User created successfully!");
      refreshUsers();
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to save user.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="animate-slideUp w-full overflow-y-auto"
          style={{ maxWidth: "560px", maxHeight: "95vh", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
        >
          {/* Gradient header */}
          <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "1.25rem 1.25rem 0 0", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                {isEdit ? "Edit User" : "Add New User"}
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>
                {isEdit ? "Update the user's details and role" : "Fill in the details to create a new account"}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "1.75rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Error */}
            {error && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
                <span>{error}</span>
              </div>
            )}

            {/* Name + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={inputWrap}>
                  <User size={14} style={iconStyle} />
                  <input
                    type="text" name="name" placeholder="John Doe"
                    value={form.name} onChange={handleChange} required
                    style={inputBase} onFocus={focusIn} onBlur={focusOut}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={inputWrap}>
                  <Mail size={14} style={iconStyle} />
                  <input
                    type="email" name="email" placeholder="john@company.com"
                    value={form.email} onChange={handleChange} required
                    style={inputBase} onFocus={focusIn} onBlur={focusOut}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>
                Password {isEdit && <span style={{ color: "#94a3b8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(leave blank to keep current)</span>}
                {!isEdit && <span style={{ color: "#ef4444" }}> *</span>}
              </label>
              <div style={inputWrap}>
                <Lock size={14} style={iconStyle} />
                <input
                  type={showPassword ? "text" : "password"} placeholder={isEdit ? "••••••••" : "Min. 8 characters"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required={!isEdit}
                  style={{ ...inputBase, paddingRight: "2.5rem" }} onFocus={focusIn} onBlur={focusOut}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Role dropdown + create button */}
            <div>
              <label style={labelStyle}>Role <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ display: "flex", gap: "0.625rem", alignItems: "stretch" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <ShieldCheck size={14} style={iconStyle} />
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    style={{ ...inputBase, paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
                    onFocus={focusIn} onBlur={focusOut}
                  >
                    <option value="" disabled>
                      {rolesLoading ? "Loading roles…" : "Select a role"}
                    </option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
                </div>

                {/* Create new role inline */}
                <button
                  type="button"
                  title="Create a new role"
                  onClick={() => setRoleModalOpen(true)}
                  style={{ width: "2.75rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "1.5px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.07)", color: "#6366f1", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.15)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.07)"; }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.375rem" }}>
                Can't find the role? Click <strong style={{ color: "#6366f1" }}>+</strong> to create a new one.
              </p>
            </div>

            {/* Department + Employee ID */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Department</label>
                <div style={inputWrap}>
                  <Building2 size={14} style={iconStyle} />
                  <input
                    type="text" name="department" placeholder="e.g. Engineering"
                    value={form.department} onChange={handleChange}
                    style={inputBase} onFocus={focusIn} onBlur={focusOut}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Employee ID</label>
                <div style={inputWrap}>
                  <BadgeCheck size={14} style={iconStyle} />
                  <input
                    type="text" name="employeeId" placeholder="e.g. EMP-001"
                    value={form.employeeId} onChange={handleChange}
                    style={inputBase} onFocus={focusIn} onBlur={focusOut}
                  />
                </div>
              </div>
            </div>

            {/* Active toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: "#f8faff", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", cursor: "pointer" }}>
              <input
                type="checkbox" name="isActive"
                checked={form.isActive} onChange={handleChange}
                style={{ width: "1rem", height: "1rem", accentColor: "#6366f1", cursor: "pointer" }}
              />
              <ToggleLeft size={16} color="#6366f1" />
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>Active User</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>User can log in and access the system</p>
              </div>
            </label>

            {/* Divider */}
            <div style={{ height: "1px", background: "#f0f2f8" }} />

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button" onClick={onClose}
                style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 600, borderRadius: "0.625rem", border: "1.5px solid #e2e8f0", background: "#f8faff", color: "#475569", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={loading}
                style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.625rem", border: "none", background: loading ? "#818cf8" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", opacity: loading ? 0.75 : 1 }}
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  : isEdit
                  ? "Update User"
                  : <><Plus size={15} /> Create User</>
                }
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Nested RoleModal — z-60 so it layers above this modal */}
      <div style={{ position: "relative", zIndex: 60 }}>
        <RoleModal
          open={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          role={null}
          refreshRoles={handleRoleCreated}
        />
      </div>
    </>
  );
}
