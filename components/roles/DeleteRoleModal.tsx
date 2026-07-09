"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Role } from "./RoleModal";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  refreshRoles: () => void;
}

export default function DeleteRoleModal({ open, onClose, role, refreshRoles }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  if (!open || !role) return null;

  const isAdmin = role.name?.toLowerCase() === "admin";

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/roles/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: role.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete role.");
      toast.success(`"${role.name}" role deleted successfully.`);
      refreshRoles();
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to delete role.");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slideUp w-full"
        style={{ maxWidth: "480px", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}
      >
        {/* Top accent bar */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, #ef4444, #f97316)" }} />

        {/* Body */}
        <div style={{ padding: "2.5rem 2.5rem 2rem", textAlign: "center" }}>
          {/* Icon */}
          <div style={{ width: "5rem", height: "5rem", borderRadius: "50%", background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <AlertTriangle size={36} color="#ef4444" />
          </div>

          <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem" }}>
            Delete Role
          </h2>

          <p style={{ fontSize: "0.9375rem", color: "#64748b", lineHeight: 1.6, margin: "0 0 0.5rem" }}>
            You are about to permanently delete the role
          </p>

          {/* Role name pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", background: "rgba(99,102,241,0.08)", border: "1.5px solid rgba(99,102,241,0.2)", borderRadius: "9999px", margin: "0.5rem 0 1rem" }}>
            <span style={{ fontSize: "1rem" }}>🛡️</span>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#4f46e5" }}>{role.name}</span>
          </div>

          {role.description && (
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: "0 0 1rem" }}>{role.description}</p>
          )}

          <div style={{ padding: "0.875rem 1rem", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "0.75rem", marginTop: "0.5rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#dc2626", fontWeight: 600, margin: 0 }}>
              ⚠️ This action cannot be undone.
            </p>
            <p style={{ fontSize: "0.8125rem", color: "#ef4444", margin: "0.25rem 0 0" }}>
              Users assigned to this role will lose their access.
            </p>
          </div>

          {isAdmin && (
            <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "0.75rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#4f46e5", fontWeight: 600, margin: 0 }}>
                🔒 The Admin role is protected and cannot be deleted.
              </p>
            </div>
          )}

          {error && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#f0f2f8", marginInline: "2.5rem" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.875rem", padding: "1.75rem 2.5rem 2.5rem" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1, padding: "0.875rem 1rem", fontSize: "0.9375rem", fontWeight: 600, borderRadius: "0.75rem", border: "1.5px solid #e2e8f0", background: "#f8faff", color: "#475569", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || isAdmin}
            style={{ flex: 1, padding: "0.875rem 1rem", fontSize: "0.9375rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", background: loading || isAdmin ? "#fca5a5" : "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", cursor: loading || isAdmin ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 14px rgba(239,68,68,0.3)", opacity: isAdmin ? 0.5 : 1 }}
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Deleting…</> : "Delete Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
