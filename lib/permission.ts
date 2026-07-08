export const AVAILABLE_PERMISSIONS = [
  { key: "dashboard",   label: "Dashboard",      icon: "📊" },
  { key: "employees",   label: "Employees",       icon: "👨💼" },
  { key: "departments", label: "Departments",     icon: "🏢" },
  { key: "attendance",  label: "Attendance",      icon: "📋" },
  { key: "leaves",      label: "Leave Requests",  icon: "📅" },
  { key: "users",       label: "Users",           icon: "👥" },
  { key: "roles",       label: "Roles",           icon: "🛡️" },
  { key: "profile",     label: "Profile",         icon: "👤" },
];

// Fallback static permissions used when Firestore roles are not yet loaded
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin:    ["dashboard", "employees", "departments", "attendance", "leaves", "users", "roles", "profile"],
  hr:       ["dashboard", "employees", "departments", "attendance", "leaves", "profile"],
  employee: ["dashboard", "attendance", "leaves", "profile"],
};
