"use client";

import { useEffect, useState } from "react";
import { X, Plus, User, Mail, Building2, BadgeCheck, ChevronDown, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import RoleModal, { Role } from "@/components/roles/RoleModal";

interface UserFormProps {
  refreshUsers: () => void;
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.6875rem", fontWeight: 700,
  color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.5rem",
};
const inputWrap: React.CSSProperties = { position: "relative" };
const iconStyle: React.CSSProperties = {
  position: "absolute", left: "0.875rem", top: "50%",
  transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 0.875rem 0.75rem 2.5rem",
  fontSize: "0.875rem", fontFamily: "inherit", background: "#f8faff",
  border: "1.5px solid #e2e8f0", borderRadius: "0.625rem",
  color: "#0f172a", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box" as const,
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "#6366f1";
  e.target.style.boxShadow   = "0 0 0 3px rgba(99,102,241,0.12)";
  e.target.style.background  = "#fff";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "#e2e8f0";
  e.target.style.boxShadow   = "none";
  e.target.style.background  = "#f8faff";
};

export default function UserForm({ refreshUsers }: UserFormProps) {
  const [isOpen, setIsOpen]   = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", role: "", department: "", employeeId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Roles from API
  const [roles, setRoles]           = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const res  = await fetch("/api/role/list");
      const data = await res.json();
      const list: Role[] = Array.isArray(data) ? data : [];
      setRoles(list);
      // Auto-select first role if none selected
      if (!form.role && list.length > 0) setForm((p) => ({ ...p, role: list[0].name }));
    } catch { /* silent */ }
    setRolesLoading(false);
  };

  useEffect(() => { if (isOpen) fetchRoles(); }, [isOpen]);

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const reset = () => { setForm({ name: "", email: "", role: "", department: "", employeeId: "" }); setError(""); };
  const handleClose = () => { reset(); setIsOpen(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role) { setError("Please select a role."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { handleClose(); refreshUsers(); }
      else setError("Failed to create user. Please try again.");
    } catch { setError("An error occurred. Please try again."); }
    setLoading(false);
  };

  // After a new role is created, refresh the list and select it
  const handleRoleCreated = async () => {
    await fetchRoles();
    setRoleModalOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
      >
        <Plus size={16} /> Add User
      </button>

      {/* User Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="animate-slideUp w-full overflow-y-auto"
            style={{ maxWidth: "540px", maxHeight: "95vh", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
          >
            {/* Gradient header */}
            <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "1.25rem 1.25rem 0 0", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>Add New User</h2>
                <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>Fill in the details to create a new account</p>
              </div>
              <button onClick={handleClose} style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd" }}>
                <X size={16} />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} style={{ padding: "1.75rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

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
                    <input type="text" placeholder="John Doe" value={form.name} onChange={set("name")} required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: "#ef4444" }}>*</span></label>
                  <div style={inputWrap}>
                    <Mail size={14} style={iconStyle} />
                    <input type="email" placeholder="john@company.com" value={form.email} onChange={set("email")} required style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              </div>

              {/* Role — dropdown + create button */}
              <div>
                <label style={labelStyle}>Role <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ display: "flex", gap: "0.625rem", alignItems: "stretch" }}>
                  {/* Dropdown */}
                  <div style={{ position: "relative", flex: 1 }}>
                    <ShieldCheck size={14} style={{ ...iconStyle, color: "#94a3b8" }} />
                    <select
                      value={form.role}
                      onChange={set("role")}
                      required
                      style={{ ...inputStyle, paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
                      onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; e.target.style.background = "#fff"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8faff"; }}
                    >
                      <option value="" disabled>{rolesLoading ? "Loading roles…" : "Select a role"}</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>{r.name.charAt(0).toUpperCase() + r.name.slice(1)}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
                  </div>

                  {/* Create role button */}
                  <button
                    type="button"
                    title="Create a new role"
                    onClick={() => setRoleModalOpen(true)}
                    style={{ width: "2.75rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "1.5px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.07)", color: "#6366f1", cursor: "pointer", transition: "all 0.15s" }}
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
                    <input type="text" placeholder="e.g. Engineering" value={form.department} onChange={set("department")} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Employee ID</label>
                  <div style={inputWrap}>
                    <BadgeCheck size={14} style={iconStyle} />
                    <input type="text" placeholder="e.g. EMP-001" value={form.employeeId} onChange={set("employeeId")} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#f0f2f8" }} />

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 600, borderRadius: "0.625rem", border: "1.5px solid #e2e8f0", background: "#f8faff", color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.625rem", border: "none", background: loading ? "#818cf8" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", opacity: loading ? 0.75 : 1 }}
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Creating…</> : <><Plus size={15} /> Create User</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Inline Role creation modal (z-60 so it sits above the user modal) */}
      <div style={{ zIndex: 60, position: "relative" }}>
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
