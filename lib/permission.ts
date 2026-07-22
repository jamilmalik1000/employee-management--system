export const AVAILABLE_PERMISSIONS = [
  { key: "dashboard",   label: "Dashboard",      icon: "📊" },
  { key: "employees",   label: "Employees",       icon: "👨💼" },
  { key: "departments", label: "Departments",     icon: "🏢" },
  { key: "attendance",  label: "Attendance",      icon: "📋" },
  { key: "leaves",      label: "Leave Requests",  icon: "📅" },
  { key: "users",       label: "Users",           icon: "👥" },
  { key: "roles",       label: "Roles",           icon: "🛡️" },
  { key: "salary",      label: "Salary",          icon: "💰" },
  { key: "expenses",    label: "Expenses",        icon: "🧾" },
  { key: "profile",     label: "Profile",         icon: "👤" },
  { key: "settings",    label: "Settings",        icon: "⚙️" },
  { key: "reports",     label: "Reports",         icon: "📈" },
];

// Fallback static permissions used when Firestore roles are not yet loaded
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin:    ["dashboard", "employees", "departments", "attendance", "leaves", "users", "roles", "salary", "expenses", "profile", "settings", "reports"],
  hr:       ["dashboard", "employees", "departments", "attendance", "leaves", "profile"],
  employee: ["dashboard", "attendance", "leaves", "profile"],
  manager:  ["dashboard", "employees", "departments", "attendance", "leaves", "reports", "profile"],
};
