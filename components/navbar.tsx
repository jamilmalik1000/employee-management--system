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
      className="z-30 flex h-13 shrink-0 items-center justify-between gap-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/98 px-3.5 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-xl"
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] text-[var(--color-text-secondary)] lg:hidden"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          className="flex size-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] text-[var(--color-accent)] transition hover:border-[var(--color-accent)]"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notification bell */}
        <button
          className="relative flex size-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] text-[var(--color-text-secondary)] transition hover:border-indigo-400"
        >
          <Bell size={16} />
          <span style={{ position: "absolute", top: "0.375rem", right: "0.375rem", width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--color-accent)", boxShadow: "0 0 0 2px var(--color-bg-surface)" }} />
        </button>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-[var(--color-border)] sm:block" />

        {/* User pill — hidden on xs */}
        <div
          className="hidden items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] px-2.5 py-1 sm:flex"
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
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
}
