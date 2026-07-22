"use client";

import { useTheme, type Theme } from "@/Context/ThemeContext";
import { usePathname } from "next/navigation";
import { Laptop, Menu, Moon, Sun } from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/employees": "Employees",
  "/dashboard/users": "Users",
  "/dashboard/departments": "Departments",
  "/dashboard/roles": "Roles",
  "/dashboard/attendence": "Attendance",
  "/dashboard/leaves": "Leaves",
  "/dashboard/salary": "Salary",
  "/dashboard/expenses": "Expenses",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
};

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "default", label: "Default", icon: Laptop },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export default function Navbar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const pageName = pageNames[pathname] ?? pathname.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? "Dashboard";

  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] text-[var(--color-text-secondary)] lg:hidden"
        >
          <Menu size={18} />
        </button>
        <h1 className="truncate text-base font-bold capitalize text-[var(--color-text-primary)] sm:text-lg">{pageName}</h1>
      </div>

      <div className="flex shrink-0 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-1" aria-label="Theme preference">
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={`${label} theme`}
            aria-pressed={theme === value}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition ${theme === value ? "bg-[var(--color-bg-surface)] text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"}`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
