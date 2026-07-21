"use client";

import { useAuth } from "@/Context/AuthContext";
import { useTheme } from "@/Context/ThemeContext";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Sun, Moon } from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: Props) {
  const { user, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push("/login"); };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials    = displayName.slice(0, 2).toUpperCase();
  const roleLabel   = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Employee";

  return (
    <header
      style={{ height: "3.75rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", background: "var(--color-bg-surface)", opacity: 0.98, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid var(--color-border)", boxShadow: "0 1px 0 0 rgba(0,0,0,0.04)", zIndex: 30, gap: "0.75rem" }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden"
          style={{ width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid var(--color-border)", background: "var(--color-bg-surface-alt)", color: "var(--color-text-secondary)", cursor: "pointer", flexShrink: 0 }}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          style={{ width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", background: "var(--color-bg-surface-alt)", border: "1px solid var(--color-border)", color: "var(--color-accent)", cursor: "pointer" }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notification bell */}
        <button
          style={{ position: "relative", width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", background: "var(--color-bg-surface-alt)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", cursor: "pointer" }}
        >
          <Bell size={16} />
          <span style={{ position: "absolute", top: "0.375rem", right: "0.375rem", width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--color-accent)", boxShadow: "0 0 0 2px var(--color-bg-surface)" }} />
        </button>

        {/* Divider */}
        <div className="hidden sm:block" style={{ width: "1px", height: "1.5rem", background: "var(--color-border)" }} />

        {/* User pill — hidden on xs */}
        <div
          className="hidden sm:flex"
          style={{ alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.75rem", background: "var(--color-bg-surface-alt)", border: "1px solid var(--color-border)", borderRadius: "0.75rem" }}
        >
          <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: "var(--gradient-identity)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-primary)", margin: 0, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</p>
            <p style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", margin: 0, textTransform: "capitalize" }}>{roleLabel}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.75rem", fontSize: "0.8125rem", fontWeight: 600, color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.16)", borderRadius: "0.5rem", cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.16)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
}
