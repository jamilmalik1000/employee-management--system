import type React from "react";

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "var(--color-text-secondary)",
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
  color: "var(--color-text-muted)",
};

export const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem 0.75rem 2.5rem",
  fontSize: "0.875rem",
  fontFamily: "inherit",
  background: "var(--color-control-bg)",
  border: "1.5px solid var(--color-border)",
  borderRadius: "0.625rem",
  color: "var(--color-text-primary)",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
  boxSizing: "border-box" as const,
};

export const textareaBase: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem 0.75rem 2.5rem",
  fontSize: "0.875rem",
  fontFamily: "inherit",
  background: "var(--color-control-bg)",
  border: "1.5px solid var(--color-border)",
  borderRadius: "0.625rem",
  color: "var(--color-text-primary)",
  outline: "none",
  resize: "vertical",
  lineHeight: 1.5,
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
  boxSizing: "border-box" as const,
};

export const focusIn = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  e.target.style.borderColor = "var(--color-primary)";
  e.target.style.boxShadow = "0 0 0 3px var(--color-primary-soft)";
  e.target.style.background = "var(--color-bg-surface)";
};

export const focusOut = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  e.target.style.borderColor = "var(--color-border)";
  e.target.style.boxShadow = "none";
  e.target.style.background = "var(--color-control-bg)";
};
