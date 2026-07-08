"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteUserModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  refreshUsers: () => void;
}

export default function DeleteUserModal({
  userId,
  userName,
  onClose,
  refreshUsers,
}: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/delete/${userId}`, { method: "DELETE" });
      if (res.ok) { refreshUsers(); onClose(); }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div
      className="modal-overlay animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-scaleIn"
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem 1rem",
            borderBottom: "1px solid #f0f2f8",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Trash2 size={14} style={{ color: "#ef4444" }} />
            </div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Delete User
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "2rem",
              height: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.5rem",
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#f1f5f9";
              (e.currentTarget as HTMLElement).style.color = "#475569";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#94a3b8";
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "1.75rem 1.75rem 1.5rem" }}>

          {/* Icon + confirmation text */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>

            {/* Pulsing danger icon */}
            <div style={{ position: "relative", display: "inline-flex" }}>
              <div
                style={{
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "50%",
                  border: "2px solid rgba(239,68,68,0.2)",
                  animation: "pulse-ring 2s ease-out infinite",
                }}
              />
              <div
                style={{
                  width: "4.5rem",
                  height: "4.5rem",
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.08)",
                  border: "2px solid rgba(239,68,68,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trash2 size={26} style={{ color: "#ef4444" }} />
              </div>
            </div>

            {/* Text */}
            <div>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "#334155",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Are you sure you want to delete{" "}
                <span
                  style={{
                    fontWeight: 700,
                    color: "#0f172a",
                    background: "#f8faff",
                    padding: "0.125rem 0.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {userName}
                </span>
                ?
              </p>
            </div>

            {/* Warning box */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
                width: "100%",
                padding: "0.875rem 1rem",
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.22)",
                borderRadius: "0.75rem",
                textAlign: "left",
              }}
            >
              <AlertTriangle
                size={14}
                style={{ color: "#f59e0b", flexShrink: 0, marginTop: "0.1rem" }}
              />
              <p style={{ fontSize: "0.8125rem", color: "#78350f", margin: 0, lineHeight: 1.55 }}>
                This action is <strong>irreversible</strong>. The user and all associated data will be permanently removed.
              </p>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: "1px", background: "#f0f2f8", marginInline: "1.75rem" }} />

        {/* ── Actions ── */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "1.25rem 1.75rem 1.5rem",
          }}
        >
          {/* Cancel */}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "0.625rem",
              border: "1.5px solid #e2e8f0",
              background: "#f8faff",
              color: "#475569",
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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

          {/* Ok / Delete */}
          <button
            id="confirm-delete-btn"
            onClick={handleDelete}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              borderRadius: "0.625rem",
              border: "none",
              background: loading
                ? "#fca5a5"
                : "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
              opacity: loading ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading)
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 20px rgba(239,68,68,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 14px rgba(239,68,68,0.3)";
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Ok, Delete
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
