"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { AppLoader } from "@/components/ui/AppState";
export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openForgot, setOpenForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, router, user]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
      if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(code)) {
        setError("Email or password is incorrect.");
      } else if (code === "auth/invalid-email") {
        setError("Enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Wait a moment and try again.");
      } else if (code === "auth/network-request-failed") {
        setError("Check your internet connection and try again.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    }
    setLoading(false);
  };

  /* shared focus/blur handlers */
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--color-primary)";
    e.target.style.boxShadow = "0 0 0 3px var(--color-primary-soft)";
    e.target.style.background = "var(--color-bg-surface)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--color-border)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "var(--color-control-bg)";
  };

  if (authLoading || user) return <AppLoader fullPage label="Checking your session…" />;

  return (
    <main
      className="login-page"
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "linear-gradient(135deg, #312e81 0%, #4f46e5 48%, #9d174d 100%)",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* decorative blobs */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "320px", height: "320px", borderRadius: "50%",
        background: "rgba(255,255,255,0.07)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", left: "-80px",
        width: "280px", height: "280px", borderRadius: "50%",
        background: "rgba(255,255,255,0.07)", pointerEvents: "none",
      }} />

      {/* Card */}
      <div
        className="login-card"
        style={{
          position: "relative",
          background: "var(--color-bg-surface)",
          borderRadius: "1.5rem",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >

        {/* ── Top colour stripe ── */}
        <div
          style={{
            height: "6px",
            background: "var(--gradient-brand)",
          }}
        />

        {/* ── Header ── */}
        <div style={{ padding: "2.5rem 2.5rem 0", textAlign: "center" }}>
          {/* Logo mark */}
          <div style={{
            width: "3.25rem", height: "3.25rem",
            borderRadius: "1rem",
            background: "var(--gradient-brand)",
            boxShadow: "0 8px 24px rgba(var(--color-primary-rgb),0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.25rem",
            fontSize: "1.25rem", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.03em",
          }}>
            E
          </div>

          <h1 style={{
            fontSize: "1.625rem", fontWeight: 800,
            color: "var(--color-text-primary)", letterSpacing: "-0.025em",
            margin: "0 0 0.375rem",
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0 }}>
            Employee Management System
          </p>
        </div>

        {/* ── Form ── */}
        <form
          onSubmit={handleLogin}
          aria-describedby={error ? "login-error" : undefined}
          style={{ padding: "2rem 2.5rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >

          {/* Error */}
          {error && (
            <div
              id="login-error"
              role="alert"
              aria-live="assertive"
              style={{
                display: "flex", alignItems: "flex-start", gap: "0.625rem",
                padding: "0.875rem 1rem",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "0.75rem",
                color: "#dc2626", fontSize: "0.875rem",
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="login-email" style={{
              fontSize: "0.75rem", fontWeight: 700,
              color: "var(--color-text-secondary)", letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={15}
                style={{
                  position: "absolute", left: "0.875rem",
                  top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none", color: "var(--color-text-muted)",
                }}
              />
              <input
                id="login-email"
                autoComplete="username"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                style={{
                  width: "100%",
                  padding: "0.8125rem 0.875rem 0.8125rem 2.625rem",
                  fontSize: "0.9375rem",
                  fontFamily: "inherit",
                  background: "var(--color-control-bg)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  color: "var(--color-text-primary)",
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="login-password" style={{
              fontSize: "0.75rem", fontWeight: 700,
              color: "var(--color-text-secondary)", letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={15}
                style={{
                  position: "absolute", left: "0.875rem",
                  top: "50%", transform: "translateY(-50%)",
                  pointerEvents: "none", color: "var(--color-text-muted)",
                }}
              />
              <input
                id="login-password"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                style={{
                  width: "100%",
                  padding: "0.8125rem 2.5rem 0.8125rem 2.625rem",
                  fontSize: "0.9375rem",
                  fontFamily: "inherit",
                  background: "var(--color-control-bg)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  color: "var(--color-text-primary)",
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ position: "absolute", right: "0.675rem", top: "50%", transform: "translateY(-50%)", width: "2.25rem", height: "2.25rem", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setOpenForgot(true)}
              style={{ minHeight: "2.5rem", fontSize: "0.875rem", color: "var(--color-primary-text)", fontWeight: 600, background: "none", border: "none", borderRadius: "0.5rem", cursor: "pointer", padding: "0.35rem 0.5rem" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Forgot Password?
            </button>
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.9375rem",
              marginTop: "0.25rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              fontFamily: "inherit",
              color: "#fff",
              background: loading
                ? "#818cf8"
                : "var(--gradient-brand)",
              border: "none",
              borderRadius: "0.75rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              boxShadow: "0 4px 18px rgba(var(--color-primary-rgb),0.35)",
              transition: "box-shadow 0.2s, transform 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(var(--color-primary-rgb),0.48)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(var(--color-primary-rgb),0.35)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Footer hint */}
          {/* <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#98989E", margin: 0 }}>
            Demo: <span style={{ color: "#F88F22", fontWeight: 600 }}>admin@example.com</span>
          </p> */}

        </form>
      </div>
      <ForgotPasswordModal
  open={openForgot}
  onClose={() => setOpenForgot(false)}
/>
    </main>
  );
}
