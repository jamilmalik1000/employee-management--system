"use client";

import { useState } from "react";
import {
  X,
  Plus,
  User,
  Mail,
  ShieldCheck,
  Building2,
  BadgeCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface UserFormProps {
  refreshUsers: () => void;
}

const ROLES = [
  { value: "employee", label: "Employee", color: "#6366f1" },
  { value: "hr",       label: "HR",       color: "#8b5cf6" },
  { value: "admin",    label: "Admin",    color: "#f59e0b" },
];

/* ─── shared style helpers ─────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "#64748b",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
};

const inputWrap: React.CSSProperties = { position: "relative" };

const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: "0.875rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "#94a3b8",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem 0.75rem 2.5rem",
  fontSize: "0.875rem",
  fontFamily: "inherit",
  background: "#f8faff",
  border: "1.5px solid #e2e8f0",
  borderRadius: "0.625rem",
  color: "#0f172a",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

export default function UserForm({ refreshUsers }: UserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", role: "employee", department: "", employeeId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const reset = () => {
    setForm({ name: "", email: "", role: "employee", department: "", employeeId: "" });
    setError("");
  };

  const handleClose = () => { reset(); setIsOpen(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { handleClose(); refreshUsers(); }
      else setError("Failed to create user. Please try again.");
    } catch {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  /* focus handlers */
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

  return (
    <>
      {/* ── Trigger ── */}
      <button
        id="add-user-btn"
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{ paddingInline: "1.25rem" }}
      >
        <Plus size={16} />
        Add User
      </button>

      {/* ── Modal ── */}
      {isOpen && (
        <div
          className="modal-overlay animate-fadeIn"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="animate-scaleIn"
            style={{
              background: "#ffffff",
              borderRadius: "1.25rem",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "95vh",
              overflowY: "auto",
              boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >

            {/* ── Gradient header ── */}
            <div
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                borderRadius: "1.25rem 1.25rem 0 0",
                padding: "1.75rem 2rem 1.5rem",
                position: "relative",
              }}
            >
              {/* Decorative blob */}
              <div style={{
                position: "absolute", top: "-20px", right: "-20px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)",
                pointerEvents: "none",
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>
                    Add New User
                  </h2>
                  <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>
                    Fill in the details to create a new account
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    width: "2.25rem", height: "2.25rem", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "0.625rem", border: "none", cursor: "pointer",
                    background: "rgba(255,255,255,0.12)", color: "#c4b5fd",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Form body ── */}
            <form
              onSubmit={handleSubmit}
              style={{ padding: "1.75rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >

              {/* Error banner */}
              {error && (
                <div
                  className="animate-slideDown"
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "0.75rem",
                    padding: "0.875rem 1rem",
                    background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem",
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
                  <span>{error}</span>
                </div>
              )}

              {/* ── Row 1: Name + Email ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>
                    Full Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={inputWrap}>
                    <User size={14} style={iconStyle} />
                    <input
                      id="user-name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={set("name")}
                      required
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>
                    Email Address <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={inputWrap}>
                    <Mail size={14} style={iconStyle} />
                    <input
                      id="user-email"
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={set("email")}
                      required
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>
              </div>

              {/* ── Role selector ── */}
              <div>
                <label style={labelStyle}>
                  Role <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
                  {ROLES.map((r) => {
                    const selected = form.role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          gap: "0.4rem",
                          padding: "0.625rem 0.75rem",
                          borderRadius: "0.625rem",
                          fontSize: "0.8125rem", fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          background: selected ? `${r.color}18` : "#f8faff",
                          border: selected ? `1.5px solid ${r.color}70` : "1.5px solid #e2e8f0",
                          color: selected ? r.color : "#64748b",
                          boxShadow: selected ? `0 0 0 3px ${r.color}14` : "none",
                        }}
                      >
                        <ShieldCheck size={13} />
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Row 2: Department + Employee ID ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* Department */}
                <div>
                  <label style={labelStyle}>Department</label>
                  <div style={inputWrap}>
                    <Building2 size={14} style={iconStyle} />
                    <input
                      id="user-department"
                      type="text"
                      placeholder="e.g. Engineering"
                      value={form.department}
                      onChange={set("department")}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label style={labelStyle}>Employee ID</label>
                  <div style={inputWrap}>
                    <BadgeCheck size={14} style={iconStyle} />
                    <input
                      id="user-employee-id"
                      type="text"
                      placeholder="e.g. EMP-001"
                      value={form.employeeId}
                      onChange={set("employeeId")}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>
              </div>

              {/* ── Divider ── */}
              <div style={{ height: "1px", background: "#f0f2f8", marginInline: "-0.5rem" }} />

              {/* ── Actions ── */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1, padding: "0.75rem 1rem",
                    fontSize: "0.875rem", fontWeight: 600,
                    borderRadius: "0.625rem", border: "1.5px solid #e2e8f0",
                    background: "#f8faff", color: "#475569",
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#f1f5f9";
                    (e.currentTarget as HTMLElement).style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#f8faff";
                    (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                  }}
                >
                  Cancel
                </button>
                <button
                  id="create-user-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1, padding: "0.75rem 1rem",
                    fontSize: "0.875rem", fontWeight: 700,
                    borderRadius: "0.625rem", border: "none",
                    background: loading ? "#818cf8" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                    color: "#fff", cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                    opacity: loading ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading)
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(99,102,241,0.48)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)";
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating…
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      Create User
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
