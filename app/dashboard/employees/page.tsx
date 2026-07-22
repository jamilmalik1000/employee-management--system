"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeModal from "@/components/employees/EmployeeModal";
import DeleteEmployeeModal from "@/components/employees/DeleteEmployeeModal";
import SalaryModal from "@/components/salary/SalaryModal";
import SalaryHistoryModal from "@/components/salary/SalaryHistoryModal";

import { Employee } from "@/types/employee";
import { SalaryRecord } from "@/types/salary";
import { emptySalaryFor } from "@/lib/salary";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";
import PageIntro from "@/components/ui/PageIntro";
import { LoadError } from "@/components/ui/AppState";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/Context/AuthContext";

export default function EmployeesPage() {
  return <PermissionGuard permission="employees"><EmployeesContent /></PermissionGuard>;
}

function EmployeesContent() {
  const { role, permissions } = useAuth();
  const canManageSalary = role === "admin" || permissions.includes("salary");
  const emptyEmployee: Employee = {
    employeeId: "",
    userId: "",
    isLogin: false,

    name: "",
    email: "",
    phone: "",

    department: "",
    designation: "",

    employmentType: "",

    gender: "",

    basicSalary: "",

    isActive: true,
  };

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee>(emptyEmployee);

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [salaryTarget, setSalaryTarget] = useState<SalaryRecord | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyEmployee, setHistoryEmployee] = useState<Employee | null>(null);

  async function fetchEmployees() {
    try {
      setLoading(true);
      setLoadError("");

      const res = await fetch("/api/employees/list");

      if (!res.ok) {
        let message = "Failed to load employee records.";
        try {
          const errorData = (await res.json()) as { message?: string };
          message = errorData.message || message;
        } catch {
          // Keep the module-specific fallback when the error body is not JSON.
        }
        throw new Error(message);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("The employee list returned an invalid response.");
      }

      setEmployees(data);
    } catch (error) {
      console.error(error);
      setLoadError(error instanceof Error ? error.message : "Failed to load employee records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  function handleAdd() {
    setSelectedEmployee(emptyEmployee);

    setModalOpen(true);
  }

  function handleEdit(employee: Employee) {
    setSelectedEmployee(employee);

    setModalOpen(true);
  }

  function handleDelete(employee: Employee) {
    setSelectedEmployee(employee);

    setDeleteOpen(true);
  }

  function handleAddSalary(employee: Employee) {
    setSalaryTarget(emptySalaryFor(employee));
    setSalaryModalOpen(true);
  }

  function handleViewSalaryHistory(employee: Employee) {
    setHistoryEmployee(employee);
    setHistoryOpen(true);
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        employee.name.toLowerCase().includes(keyword) ||
        employee.email.toLowerCase().includes(keyword) ||
        employee.phone.toLowerCase().includes(keyword) ||
        employee.employeeId.toLowerCase().includes(keyword);

      const matchesDepartment =
        departmentFilter === "" ||
        employee.department === departmentFilter;

      const matchesStatus =
        statusFilter === "" ||
        String(employee.isActive) === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, search, departmentFilter, statusFilter]);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter((x) => x.isActive).length;

  const inactiveEmployees = employees.filter((x) => !x.isActive).length;

  const loginEmployees = employees.filter((x) => x.isLogin).length;

  const departments = [
    ...new Set(
      employees.map((e) => e.department).filter(Boolean)
    ),
  ];

  const statCards = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: "👥",
      color: "#6366f1",
      bg: "rgba(99,102,241,0.08)",
      border: "rgba(99,102,241,0.15)",
    },
    {
      label: "Active",
      value: activeEmployees,
      icon: "✅",
      color: "#059669",
      bg: "rgba(5,150,105,0.08)",
      border: "rgba(5,150,105,0.15)",
    },
    {
      label: "Inactive",
      value: inactiveEmployees,
      icon: "⚪",
      color: "#dc2626",
      bg: "rgba(220,38,38,0.08)",
      border: "rgba(220,38,38,0.15)",
    },
    {
      label: "Login Enabled",
      value: loginEmployees,
      icon: "🔑",
      color: "#7c3aed",
      bg: "rgba(124,58,237,0.08)",
      border: "rgba(124,58,237,0.15)",
    },
  ];

  return (
    <div className="page-root">
      <PageIntro description="Manage employee records, roles and access" actions={
        <button
          onClick={handleAdd}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Employee
        </button>
      } />

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.75rem",
                background: s.bg,
                border: `1.5px solid ${s.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <p
                style={{
                  fontSize: "1.625rem",
                  fontWeight: 800,
                  color: s.color,
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {loading || loadError ? "—" : s.value}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                }}
              >
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          padding: "1.25rem 1.5rem",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.875rem",
          alignItems: "center",
        }}
      >
        <div style={inputWrap}>
          <Search size={14} style={iconStyle} />
          <input
            type="text"
            aria-label="Search employees"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputBase}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div style={{ ...inputWrap, position: "relative" }}>
          <select
            aria-label="Filter employees by department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
              ...inputBase,
              paddingLeft: "0.875rem",
              paddingRight: "2.5rem",
              appearance: "none",
              cursor: "pointer",
            }}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <span
            style={{
              position: "absolute",
              right: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#94a3b8",
              fontSize: "0.75rem",
            }}
          >
            ▾
          </span>
        </div>

        <div style={{ ...inputWrap, position: "relative" }}>
          <select
            aria-label="Filter employees by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              ...inputBase,
              paddingLeft: "0.875rem",
              paddingRight: "2.5rem",
              appearance: "none",
              cursor: "pointer",
            }}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <span
            style={{
              position: "absolute",
              right: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#94a3b8",
              fontSize: "0.75rem",
            }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Employee Table */}
      {loadError ? (
        <div className="card">
          <LoadError message={loadError} onRetry={fetchEmployees} />
        </div>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddSalary={handleAddSalary}
          onViewSalaryHistory={handleViewSalaryHistory}
          canManageSalary={canManageSalary}
          emptyTitle={search || departmentFilter || statusFilter ? "No employees match your filters" : undefined}
          emptyDescription={search || departmentFilter || statusFilter ? "Adjust or clear the filters to see more employees." : undefined}
        />
      )}

      {/* Employee Modal */}
      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={selectedEmployee}
        refreshEmployees={fetchEmployees}
        canManageSalary={canManageSalary}
      />

      {/* Delete Modal */}
      <DeleteEmployeeModal
        open={deleteOpen}
        employee={selectedEmployee}
        onClose={() => setDeleteOpen(false)}
        refreshEmployees={fetchEmployees}
      />

      {/* Add Salary Modal */}
      {salaryTarget && (
        <SalaryModal
          open={salaryModalOpen}
          onClose={() => setSalaryModalOpen(false)}
          salary={salaryTarget}
          refreshSalary={() => {}}
        />
      )}

      {/* Salary History Modal */}
      <SalaryHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        employee={historyEmployee}
      />
    </div>
  );
}
