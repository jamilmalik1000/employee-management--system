"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard, Users, Building2, CalendarCheck,
  CalendarDays, UserCog, UserCircle, ShieldCheck, LogOut, X,
  Receipt, Settings, ChevronDown, PanelLeftClose, PanelLeftOpen, Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TOP_NAV_ITEMS = [
  { href: "/dashboard",             label: "Dashboard",      icon: LayoutDashboard, permission: "dashboard"   },
  { href: "/dashboard/employees",   label: "Employees",      icon: Users,           permission: "employees"   },
  { href: "/dashboard/departments", label: "Departments",    icon: Building2,       permission: "departments" },
  { href: "/dashboard/attendance",  label: "Attendance",     icon: CalendarCheck,   permission: "attendance"  },
  { href: "/dashboard/leaves",      label: "Leave Requests", icon: CalendarDays,    permission: "leaves"      },
];

const ADMIN_NAV_ITEMS = [
  { href: "/dashboard/users",    label: "Users & Permissions", icon: UserCog,     permission: "users"    },
  { href: "/dashboard/roles",    label: "Roles",               icon: ShieldCheck, permission: "roles"    },
  { href: "/dashboard/salary",   label: "Salary",              icon: Wallet,      permission: "salary"   },
  { href: "/dashboard/expenses", label: "Expenses",            icon: Receipt,     permission: "expenses" },
  { href: "/dashboard/settings", label: "Settings",            icon: Settings,    permission: "settings" },
];

const BOTTOM_NAV_ITEMS = [
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle, permission: "profile" },
];

const COLLAPSE_KEY = "ems-sidebar-collapsed";

interface Props {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: Props) {
  const { role, user, logout, permissions } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const isAdmin = role?.toLowerCase() === "admin";
  const can     = (permission: string) => isAdmin || permissions.includes(permission);

  const topItems    = TOP_NAV_ITEMS.filter((item) => can(item.permission));
  const adminItems  = ADMIN_NAV_ITEMS.filter((item) => can(item.permission));
  const bottomItems = BOTTOM_NAV_ITEMS.filter((item) => can(item.permission));

  const [adminOpen, setAdminOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const mobileDrawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (ADMIN_NAV_ITEMS.some((item) => item.href === pathname)) setAdminOpen(true);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousFocus = document.getElementById("mobile-menu-trigger") ?? document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileDrawerRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMobileClose?.();
        return;
      }
      if (event.key !== "Tab" || !mobileDrawerRef.current) return;
      const controls = Array.from(mobileDrawerRef.current.querySelectorAll<HTMLElement>("a, button:not([disabled]), [tabindex]:not([tabindex='-1'])"))
        .filter((element) => element.getClientRects().length > 0);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [mobileOpen, onMobileClose]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";
  const name      = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials  = name.slice(0, 2).toUpperCase();

  const handleLogout = () => { logout(); router.push("/login"); };
  const handleNav    = () => { onMobileClose?.(); };

  function renderSidebar(mini: boolean, variant: "desktop" | "mobile") {
    const linkStyle = (isActive: boolean): React.CSSProperties => ({
      display: "flex", alignItems: "center", gap: mini ? 0 : "0.75rem",
      justifyContent: mini ? "center" : "flex-start",
      padding: mini ? "0.625rem" : "0.625rem 0.75rem",
      borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: isActive ? 600 : 500,
      textDecoration: "none", transition: "all 0.15s",
      color: isActive ? "#fff" : "var(--sidebar-text)",
      background: isActive ? "linear-gradient(135deg, rgba(218,0,144,0.26), rgba(242,203,48,0.14))" : "transparent",
      border: isActive ? "1px solid rgba(218,0,144,0.32)" : "1px solid transparent",
    });

    const renderLink = (item: { href: string; label: string; icon: LucideIcon }, small?: boolean) => {
      const Icon     = item.icon;
      const isLegacyAttendance = item.href === "/dashboard/attendance" && pathname === "/dashboard/attendence";
      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) || isLegacyAttendance;
      return (
        <Link key={item.href} href={item.href} onClick={handleNav} title={mini ? item.label : undefined} aria-current={isActive ? "page" : undefined} style={linkStyle(isActive)}>
          <Icon size={small ? 15 : 16} style={{ flexShrink: 0, color: isActive ? "#F2CB30" : "var(--sidebar-text-muted)" }} />
          {!mini && <span style={{ flex: 1 }}>{item.label}</span>}
          {!mini && isActive && <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", background: "#F2CB30", flexShrink: 0 }} />}
        </Link>
      );
    };

    return (
      <aside id={variant === "mobile" ? "mobile-navigation" : undefined} ref={variant === "mobile" ? mobileDrawerRef : undefined} role={variant === "mobile" ? "dialog" : undefined} aria-modal={variant === "mobile" ? true : undefined} aria-label={variant === "mobile" ? "Main navigation" : undefined} style={{ width: mini ? "76px" : "240px", height: "100%", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", background: "var(--gradient-sidebar)", borderRight: "1px solid rgba(255,255,255,0.06)", transition: "width 0.18s ease" }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: mini ? "center" : "space-between", padding: mini ? "1.375rem 0.75rem" : "1.375rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <div style={{ width: "2.125rem", height: "2.125rem", borderRadius: "0.625rem", background: "var(--gradient-identity)", boxShadow: "0 4px 12px rgba(var(--color-identity-rgb),0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.875rem", color: "#fff", flexShrink: 0 }}>
              E
            </div>
            {!mini && (
              <div style={{ lineHeight: 1.3, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--sidebar-text-strong)", margin: 0 }}>EMS</p>
                <p style={{ fontSize: "0.6875rem", color: "var(--sidebar-text-muted)", margin: 0 }}>Employee System</p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          {variant === "mobile" && (
            <button onClick={onMobileClose} aria-label="Close navigation" style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "0.5rem", width: "2.5rem", height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--sidebar-text)", flexShrink: 0 }}>
              <X size={16} />
            </button>
          )}

          {/* Desktop collapse toggle */}
          {variant === "desktop" && !mini && (
            <button
              onClick={toggleCollapsed}
              title="Collapse sidebar"
              style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "0.5rem", width: "2.5rem", height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--sidebar-text)", flexShrink: 0 }}
            >
              <PanelLeftClose size={15} />
            </button>
          )}
        </div>

        {/* Desktop collapse toggle — mini state (own row, centered) */}
        {variant === "desktop" && mini && (
          <button
            onClick={toggleCollapsed}
            title="Expand sidebar"
            style={{ minHeight: "2.5rem", background: "rgba(255,255,255,0.06)", border: "none", borderTop: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", width: "100%", padding: "0.625rem 0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--sidebar-text)" }}
          >
            <PanelLeftOpen size={16} />
          </button>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: mini ? "1rem 0.5rem" : "1rem 0.75rem", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
          {!mini && (
            <p style={{ fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--sidebar-text-muted)", padding: "0 0.625rem", marginBottom: "0.5rem" }}>
              Navigation
            </p>
          )}

          {topItems.map((item) => renderLink(item))}

          {/* Administration group */}
          {adminItems.length > 0 && (
            <>
              {mini ? (
                <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0.5rem 0.375rem" }} />
              ) : (
                <button
                  type="button"
                  onClick={() => setAdminOpen((o) => !o)}
                  aria-expanded={adminOpen}
                  aria-controls={`${variant}-sidebar-admin-links`}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.75rem",
                    borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 500, textAlign: "left",
                    color: adminOpen ? "var(--sidebar-text-strong)" : "var(--sidebar-text)", background: "transparent",
                    border: "1px solid transparent", cursor: "pointer", width: "100%",
                  }}
                >
                  <ShieldCheck size={16} style={{ flexShrink: 0, color: adminOpen ? "#F2CB30" : "var(--sidebar-text-muted)" }} />
                  <span style={{ flex: 1 }}>Administration</span>
                  <ChevronDown
                    size={14}
                    style={{ flexShrink: 0, color: "var(--sidebar-text-muted)", transition: "transform 0.15s", transform: adminOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
              )}

              {(mini || adminOpen) && (
                <div id={`${variant}-sidebar-admin-links`} style={{ display: "flex", flexDirection: "column", gap: "0.125rem", paddingLeft: mini ? 0 : "0.875rem", marginLeft: mini ? 0 : "1.125rem", borderLeft: mini ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                  {adminItems.map((item) => renderLink(item, true))}
                </div>
              )}
            </>
          )}

          {bottomItems.map((item) => renderLink(item))}
        </nav>

        {/* User footer */}
        <div style={{ padding: mini ? "0.75rem 0.5rem" : "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: mini ? "center" : "flex-start", gap: "0.625rem", padding: mini ? "0.5rem" : "0.625rem 0.75rem", borderRadius: "0.625rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div title={mini ? name : undefined} style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "var(--gradient-identity)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.6875rem", flexShrink: 0 }}>
              {initials}
            </div>
            {!mini && (
              <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--sidebar-text-strong)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textTransform: "capitalize" }}>{name}</p>
                <p style={{ fontSize: "0.6875rem", color: "var(--sidebar-text-muted)", margin: 0 }}>{roleLabel}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title={mini ? "Sign out" : undefined}
            style={{ minHeight: "2.5rem", display: "flex", alignItems: "center", justifyContent: mini ? "center" : "flex-start", gap: mini ? 0 : "0.625rem", padding: mini ? "0.5rem" : "0.5rem 0.75rem", borderRadius: "0.625rem", fontSize: "0.8125rem", fontWeight: 500, color: "var(--sidebar-text)", background: "transparent", border: "none", cursor: "pointer", transition: "all 0.15s", width: "100%", textAlign: "left" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,63,184,0.1)"; (e.currentTarget as HTMLElement).style.color = "#FF6BC9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--sidebar-text)"; }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!mini && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden h-screen h-dvh lg:flex lg:flex-shrink-0">
        {renderSidebar(collapsed, "desktop")}
      </div>

      {/* Mobile drawer — always full width, never collapsed */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={onMobileClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 40 }}
          />
          {/* Drawer */}
          <div className="animate-slideInLeft h-screen h-dvh" style={{ position: "fixed", top: 0, left: 0, zIndex: 50 }}>
            {renderSidebar(false, "mobile")}
          </div>
        </>
      )}
    </>
  );
}
