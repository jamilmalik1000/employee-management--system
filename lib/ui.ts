import type React from "react";

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "#64748b",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
};

export const inputWrap: React.CSSProperties = { position: "relative" };

export const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: "0.875rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "#94a3b8",
};

export const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem 0.75rem 2.5rem",
  fontSize: "0.875rem",
  fontFamily: "inherit",
  background: "#f8faff",
  border: "1.5px solid #e2e8f0",
  borderRadius: "0.625rem",
  color: "#0f172a",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
  boxSizing: "border-box" as const,
};

export const focusIn = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
) => {
  e.target.style.borderColor = "#6366f1";
  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
  e.target.style.background = "#fff";
};

export const focusOut = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
) => {
  e.target.style.borderColor = "#e2e8f0";
  e.target.style.boxShadow = "none";
  e.target.style.background = "#f8faff";
};
