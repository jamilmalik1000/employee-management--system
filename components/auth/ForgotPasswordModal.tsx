"use client";

import { useEffect, useRef, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { X, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useDialog } from "@/hooks/useDialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (loading) return;
    setEmail("");
    setSent(false);
    onClose();
  };
  const dialogRef = useDialog<HTMLDivElement>(open, handleClose);

  useEffect(() => {
    if (open && sent) successRef.current?.focus();
  }, [open, sent]);

  if (!open) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Could not send the reset email. Check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: "1rem" }}
      onClick={(e) => e.target === e.currentTarget && !loading && handleClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-modal-title"
        tabIndex={-1}
        className="animate-slideUp"
        style={{ width: "100%", maxWidth: "440px", maxHeight: "92dvh", background: "#fff", borderRadius: "1.5rem", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflowY: "auto" }}
      >
        {/* Top stripe */}
        <div style={{ height: "5px", background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)" }} />

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Mail size={18} color="#fff" />
            </div>
            <div>
              <h2 id="forgot-password-modal-title" style={{ fontSize: "1.125rem", fontWeight: 800, color: "#fff", margin: 0 }}>Forgot Password?</h2>
              <p style={{ fontSize: "0.8rem", color: "#c4b5fd", margin: "0.25rem 0 0" }}>
                We’ll send a reset link to your email
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close password reset form"
            onClick={handleClose}
            disabled={loading}
            style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem" }}>
          {sent ? (
            /* ── Success state ── */
            <div
              ref={successRef}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              tabIndex={-1}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "1rem 0 0.5rem", textAlign: "center", outline: "none" }}
            >
              <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: "rgba(5,150,105,0.08)", border: "2px solid rgba(5,150,105,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={32} color="#059669" />
              </div>
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.375rem" }}>Check your inbox</p>
                <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  A password reset link has been sent to<br />
                  <span style={{ fontWeight: 700, color: "#4f46e5" }}>{email}</span>
                </p>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>
                Didn’t receive it? Check your spam folder.
              </p>
              <button
                onClick={handleClose}
                style={{ marginTop: "0.5rem", width: "100%", padding: "0.8125rem", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Enter the email address associated with your account and we’ll send you a link to reset your password.
              </p>

              {/* Email input */}
              <div>
                <label htmlFor="forgot-password-email" style={{ display: "block", fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>
                  Email Address <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
                  <input
                    id="forgot-password-email"
                    autoComplete="email"
                    data-autofocus
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", padding: "0.8125rem 0.875rem 0.8125rem 2.625rem", fontSize: "0.9375rem", fontFamily: "inherit", background: "#f8faff", border: "1.5px solid #e2e8f0", borderRadius: "0.75rem", color: "#0f172a", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; e.target.style.background = "#fff"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8faff"; }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#f0f2f8" }} />

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  style={{ flex: 1, padding: "0.8125rem", fontSize: "0.9rem", fontWeight: 600, borderRadius: "0.75rem", border: "1.5px solid #e2e8f0", background: "#f8faff", color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, padding: "0.8125rem", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", background: loading ? "#818cf8" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", opacity: loading ? 0.75 : 1 }}
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Send Reset Link"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
