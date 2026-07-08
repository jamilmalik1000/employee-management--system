"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";

export default function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const menuItems = {
    admin: [
      { href: "/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/dashboard/employees", label: "Employees", icon: "👨‍💼" },
      { href: "/dashboard/departments", label: "Departments", icon: "🏢" },
      { href: "/dashboard/attendance", label: "Attendance", icon: "📋" },
      { href: "/dashboard/leaves", label: "Leave Requests", icon: "📅" },
      { href: "/dashboard/users", label: "Users", icon: "👥" },
      { href: "/dashboard/profile", label: "Profile", icon: "👤" },
      { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
    ],

    hr: [
      { href: "/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/dashboard/employees", label: "Employees", icon: "👨‍💼" },
      { href: "/dashboard/departments", label: "Departments", icon: "🏢" },
      { href: "/dashboard/attendance", label: "Attendance", icon: "📋" },
      { href: "/dashboard/leaves", label: "Leave Requests", icon: "📅" },
      { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    ],

    employee: [
      { href: "/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/dashboard/attendance", label: "Attendance", icon: "📋" },
      { href: "/dashboard/leaves", label: "My Leaves", icon: "📅" },
      { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    ],
  };

  const navItems =
    role && role in menuItems
      ? menuItems[role as keyof typeof menuItems]
      : [];

  return (
    <aside className="w-64 h-screen flex-shrink-0 bg-slate-800 text-white flex flex-col p-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">EMS</h1>
        <p className="text-sm text-gray-400 m-0">Employee Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all duration-200 cursor-pointer ${
              pathname === item.href
                ? "bg-blue-500 text-white"
                : "text-gray-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4 text-gray-400">
        <div className="text-sm mb-2">Logged in as</div>
        <div className="font-semibold text-white capitalize">{role}</div>
      </div>
    </aside>
  );
}