"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign, BarChart2, Building2, CalendarDays, Clock, ReceiptText, Settings2,
  ShieldCheck, UserCheck, UserRound, UserRoundPlus, Users,
} from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import PageIntro from "@/components/ui/PageIntro";
import { LoadError } from "@/components/ui/AppState";
import { todayLocalISO } from "@/lib/date";
import type { Employee } from "@/types/employee";
import type { Attendance } from "@/types/attendance";
import type { Department } from "@/types/department";
import PermissionGuard from "@/components/PermissionGuard";

const quickLinks = [
  { permission: "employees", label: "Employees", href: "/dashboard/employees", icon: UserRoundPlus, desc: "Manage employee profiles and access" },
  { permission: "departments", label: "Departments", href: "/dashboard/departments", icon: Building2, desc: "Organize teams and departments" },
  { permission: "users", label: "Manage Users", href: "/dashboard/users", icon: Users, desc: "View and manage user access" },
  { permission: "roles", label: "Roles & Permissions", href: "/dashboard/roles", icon: ShieldCheck, desc: "Define roles and module permissions" },
  { permission: "attendance", label: "Attendance", href: "/dashboard/attendance", icon: BarChart2, desc: "Track daily attendance records" },
  { permission: "leaves", label: "Leave Requests", href: "/dashboard/leaves", icon: Clock, desc: "Review and manage time off" },
  { permission: "salary", label: "Salary", href: "/dashboard/salary", icon: BadgeDollarSign, desc: "Manage payroll and payment status" },
  { permission: "expenses", label: "Expenses", href: "/dashboard/expenses", icon: ReceiptText, desc: "Review operational expenses" },
  { permission: "profile", label: "Profile", href: "/dashboard/profile", icon: UserRound, desc: "Review your account and access" },
  { permission: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings2, desc: "Update company preferences" },
];

async function getList<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Could not load ${url}.`);
  return Array.isArray(data) ? data : [];
}

export default function DashboardPage() {
  return <PermissionGuard permission="dashboard"><DashboardContent /></PermissionGuard>;
}

function DashboardContent() {
  const { user, role, permissions } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [ownEmployee, setOwnEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const name = user?.displayName || user?.email?.split("@")[0] || "there";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const can = (permission: string) => role === "admin" || permissions.includes(permission);
  const canViewEmployees = can("employees");
  const canViewDepartments = can("departments");
  const canViewAttendance = can("attendance");
  const canViewWorkforceSummary = canViewEmployees || canViewDepartments;

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const employeePromise = canViewEmployees
        ? getList<Employee>("/api/employees/list")
        : Promise.resolve<Employee[]>([]);
      const departmentPromise = canViewDepartments
        ? getList<Department>("/api/departments/list")
        : Promise.resolve<Department[]>([]);

      let attendancePromise: Promise<Attendance[]> = Promise.resolve([]);
      let linkedEmployee: Employee | null = null;

      if (canViewAttendance && canViewEmployees) {
        attendancePromise = getList<Attendance>("/api/attendance/list");
      } else if (canViewAttendance && user?.uid) {
        const linkedEmployees = await getList<Employee>(`/api/employees/list?userId=${encodeURIComponent(user.uid)}`);
        linkedEmployee = linkedEmployees[0] || null;
        if (linkedEmployee?.id) {
          attendancePromise = getList<Attendance>(`/api/attendance/list?employeeId=${encodeURIComponent(linkedEmployee.id)}`);
        }
      }

      const [employeeData, departmentData, attendanceData] = await Promise.all([
        employeePromise,
        departmentPromise,
        attendancePromise,
      ]);
      setEmployees(employeeData);
      setDepartments(departmentData);
      setAttendance(attendanceData);
      setOwnEmployee(linkedEmployee);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The dashboard summary could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [canViewAttendance, canViewDepartments, canViewEmployees, user?.uid]);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  const todayAttendance = attendance.filter((record) => record.date === todayLocalISO());
  const presentToday = todayAttendance.filter((record) => record.status === "Present" || record.status === "Late").length;
  const leaveToday = todayAttendance.filter((record) => record.status === "Leave").length;
  const activeEmployees = employees.filter((employee) => employee.isActive).length;
  const activeDepartments = departments.filter((department) => department.isActive).length;
  const attendanceRate = todayAttendance.length ? Math.round((presentToday / todayAttendance.length) * 100) : 0;

  const departmentBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    employees.forEach((employee) => {
      const department = employee.department || "Unassigned";
      counts.set(department, (counts.get(department) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([department, count]) => ({ department, count, percentage: employees.length ? Math.round((count / employees.length) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [employees]);

  const stats = [
    ...(canViewEmployees ? [{ label: "Total Employees", value: employees.length, detail: `${activeEmployees} active`, icon: Users, tone: "primary" }] : []),
    ...(canViewDepartments ? [{ label: "Departments", value: departments.length, detail: `${activeDepartments} active`, icon: Building2, tone: "warning" }] : []),
    ...(canViewAttendance && canViewEmployees ? [
      { label: "Present Today", value: presentToday, detail: `${attendanceRate}% attendance`, icon: UserCheck, tone: "success" },
      { label: "On Leave Today", value: leaveToday, detail: `${todayAttendance.length} records today`, icon: CalendarDays, tone: "danger" },
    ] : []),
    ...(canViewAttendance && !canViewEmployees ? [
      { label: "Today", value: todayAttendance[0]?.status || "Not recorded", detail: ownEmployee ? "Your attendance status" : "Employee profile not linked", icon: UserCheck, tone: "success" },
      { label: "Attendance Records", value: attendance.length, detail: "Your personal history", icon: CalendarDays, tone: "primary" },
    ] : []),
  ];

  return (
    <div className="page-root" aria-busy={loading}>
      <PageIntro description={today} actions={
        <div className="user-summary">
          <div className="avatar" style={{ width: "1.875rem", height: "1.875rem", background: "var(--gradient-identity)", color: "#fff", fontSize: ".72rem" }}>{name.charAt(0).toUpperCase()}</div>
          <div><p style={{ color: "var(--color-text-primary)", fontSize: ".8rem", fontWeight: 700, lineHeight: 1.2 }}>{name}</p><p style={{ color: "var(--color-text-muted)", fontSize: ".68rem", textTransform: "capitalize" }}>{role}</p></div>
        </div>
      } />

      <section className="welcome-banner" aria-label="Welcome">
        <p>Good to see you back</p>
        <h2>Welcome, {name}!</h2>
        <span>{canViewWorkforceSummary ? "Your latest workforce summary is shown below." : "Your personal workspace is ready."}</span>
      </section>

      {error && <div className="card"><LoadError message={error} onRetry={loadSummary} /></div>}

      {!error && stats.length > 0 && (
        <section className="stat-grid" aria-label={canViewWorkforceSummary ? "Workforce summary" : "Personal attendance summary"}>
          {stats.map(({ label, value, detail, icon: Icon, tone }) => (
            <article className="card stat-card-ui" data-tone={tone} key={label}>
              <span className="stat-icon"><Icon size={19} /></span>
              <div><strong>{loading ? "—" : value}</strong><p>{label}</p><small>{loading ? "Loading…" : detail}</small></div>
            </article>
          ))}
        </section>
      )}

      {!error && canViewEmployees && (
        <div className="dashboard-grid" style={{ display: "grid", gap: "1.25rem", alignItems: "start" }}>
          <section className="card data-section" aria-labelledby="team-overview-title">
            <div className="section-heading"><div><h2 id="team-overview-title">Team overview</h2><p>Recently returned employee records.</p></div><UserRoundPlus size={20} /></div>
            <div className="dashboard-list">
              {!loading && employees.length === 0 && <p className="dashboard-empty">No employee records are available yet.</p>}
              {employees.slice(0, 6).map((employee) => (
                <div key={employee.id || employee.employeeId}>
                  <span className="avatar">{employee.name?.charAt(0)?.toUpperCase() || "?"}</span>
                  <div><strong>{employee.name}</strong><p>{employee.designation || "No designation"} · {employee.department || "Unassigned"}</p></div>
                  <span role="img" className={employee.isActive ? "status-dot active" : "status-dot"} aria-label={employee.isActive ? "Active" : "Inactive"} />
                </div>
              ))}
            </div>
          </section>

          <section className="card data-section" aria-labelledby="department-breakdown-title">
            <div className="section-heading"><div><h2 id="department-breakdown-title">Department breakdown</h2><p>Employee distribution.</p></div><Building2 size={20} /></div>
            <div className="department-bars">
              {!loading && departmentBreakdown.length === 0 && <p className="dashboard-empty">No department assignments yet.</p>}
              {departmentBreakdown.map((item) => (
                <div key={item.department}><div><span>{item.department}</span><strong>{item.count}</strong></div><div className="progress-track"><span style={{ width: `${item.percentage}%` }} /></div></div>
              ))}
            </div>
          </section>
        </div>
      )}

      <section aria-labelledby="quick-access-title">
        <h2 id="quick-access-title" className="eyebrow-heading">Quick access</h2>
        <div className="quick-link-grid">
          {quickLinks.filter((link) => can(link.permission)).map(({ icon: Icon, ...link }) => (
            <Link key={link.href} href={link.href} className="card quick-link">
              <span><Icon size={19} /></span><div><strong>{link.label}</strong><p>{link.desc}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
