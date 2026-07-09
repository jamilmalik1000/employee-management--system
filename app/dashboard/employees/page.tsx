"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeModal from "@/components/employees/EmployeeModal";
import DeleteEmployeeModal from "@/components/employees/DeleteEmployeeModal";

import { Employee } from "@/types/employee";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";

export default function EmployeesPage() {
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

    isActive: true,
  };

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee>(emptyEmployee);

  async function fetchEmployees() {
    try {
      setLoading(true);

      const res = await fetch("/api/employees/list");

      const data = await res.json();

      setEmployees(data);
    } catch (error) {
      console.error(error);
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.375rem",
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Employee Management
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#64748b",
              marginTop: "0.25rem",
            }}
          >
            Manage employee records, roles and access
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-primary"
          style={{ padding: "0.75rem 1.25rem" }}
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

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
                {s.value}
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
      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Employee Modal */}
      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={selectedEmployee}
        refreshEmployees={fetchEmployees}
      />

      {/* Delete Modal */}
      <DeleteEmployeeModal
        open={deleteOpen}
        employee={selectedEmployee}
        onClose={() => setDeleteOpen(false)}
        refreshEmployees={fetchEmployees}
      />
    </div>
  );
}
