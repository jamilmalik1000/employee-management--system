"use client";

import { Users } from "lucide-react";
import { Employee } from "@/types/employee";
import EmployeeActionsMenu from "@/components/employees/EmployeeActionsMenu";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";

interface Props {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onAddSalary: (employee: Employee) => void;
  onViewSalaryHistory: (employee: Employee) => void;
}

const typeMeta: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  "Full Time": {
    color: "#059669",
    bg: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.15)",
  },
  "Part Time": {
    color: "#d97706",
    bg: "rgba(217,119,6,0.07)",
    border: "rgba(217,119,6,0.15)",
  },
  Intern: {
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.15)",
  },
  Contract: {
    color: "#0891b2",
    bg: "rgba(8,145,178,0.07)",
    border: "rgba(8,145,178,0.15)",
  },
};

const defaultMeta = {
  color: "#6366f1",
  bg: "rgba(99,102,241,0.07)",
  border: "rgba(99,102,241,0.15)",
};

export default function EmployeeTable({
  employees,
  loading,
  onEdit,
  onDelete,
  onAddSalary,
  onViewSalaryHistory,
}: Props) {
  const pagination = usePagination(employees);
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "1rem",
        border: "1px solid #e8ecf4",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.125rem 1.5rem",
          borderBottom: "1px solid #f0f2f8",
          background: "#fafbff",
        }}
      >
        <h2
          style={{
            fontSize: "0.9375rem",
            fontWeight: 700,
            color: "#1e293b",
            margin: 0,
          }}
        >
          All Employees
        </h2>
        {!loading && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              background: "#f1f5f9",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontWeight: 600,
            }}
          >
            {employees.length}{" "}
            {employees.length === 1 ? "employee" : "employees"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 1rem",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "2.25rem",
              height: "2.25rem",
              border: "3px solid #e2e8f0",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
            Loading employees…
          </p>
        </div>
      ) : employees.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 1rem",
            gap: "0.75rem",
          }}
        >
          <Users size={48} color="#e2e8f0" />
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "#64748b",
              margin: 0,
            }}
          >
            No employees yet
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            Click "Add Employee" to create the first one.
          </p>
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
              minWidth: "720px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8faff",
                  borderBottom: "1px solid #f0f2f8",
                }}
              >
                {[
                  { label: "Employee ID", hide: "sm" },
                  { label: "Employee", hide: "" },
                  { label: "Phone", hide: "md" },
                  { label: "Department", hide: "lg" },
                  { label: "Designation", hide: "lg" },
                  { label: "Type", hide: "md" },
                  { label: "Login", hide: "sm" },
                  { label: "Status", hide: "sm" },
                  { label: "Actions", hide: "" },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={col.hide ? `hidden ${col.hide}:table-cell` : ""}
                    style={{
                      padding: "0.875rem 1rem",
                      textAlign:
                        col.label === "Actions" ? "center" : "left",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagination.pageItems.map((employee, i) => {
                const isActive = employee.isActive ?? true;
                const type = (employee.employmentType || "").trim();
                const meta = typeMeta[type] ?? defaultMeta;
                const initial =
                  employee.name?.charAt(0)?.toUpperCase() || "?";

                return (
                  <tr
                    key={employee.id}
                    style={{
                      borderBottom:
                        i < employees.length - 1
                          ? "1px solid #f0f2f8"
                          : "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fafbff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Employee ID */}
                    <td
                      className="hidden sm:table-cell"
                      style={{
                        padding: "0.875rem 1rem",
                        fontWeight: 600,
                        color: "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {employee.employeeId || "—"}
                    </td>

                    {/* Name */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "0.5rem",
                            background:
                              "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))",
                            border: "1px solid rgba(99,102,241,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#6366f1",
                          }}
                        >
                          {initial}
                        </div>
                        <div>
                          <p
                            style={{
                              fontWeight: 700,
                              color: "#1e293b",
                              margin: 0,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {employee.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                              margin: 0,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td
                      className="hidden md:table-cell"
                      style={{
                        padding: "0.875rem 1rem",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {employee.phone || "—"}
                    </td>

                    {/* Department */}
                    <td
                      className="hidden lg:table-cell"
                      style={{
                        padding: "0.875rem 1rem",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {employee.department || (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Designation */}
                    <td
                      className="hidden lg:table-cell"
                      style={{
                        padding: "0.875rem 1rem",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {employee.designation || (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Employment Type badge */}
                    <td
                      className="hidden md:table-cell"
                      style={{ padding: "0.875rem 1rem" }}
                    >
                      {type ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0.2rem 0.625rem",
                            background: meta.bg,
                            border: `1px solid ${meta.border}`,
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: meta.color,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {type}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Login badge */}
                    <td
                      className="hidden sm:table-cell"
                      style={{ padding: "0.875rem 1rem" }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.2rem 0.625rem",
                          background: employee.isLogin
                            ? "rgba(99,102,241,0.07)"
                            : "rgba(100,116,139,0.07)",
                          border: `1px solid ${
                            employee.isLogin
                              ? "rgba(99,102,241,0.15)"
                              : "rgba(100,116,139,0.15)"
                          }`,
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: employee.isLogin ? "#6366f1" : "#64748b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {employee.isLogin ? "Login" : "No Login"}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td
                      className="hidden sm:table-cell"
                      style={{ padding: "0.875rem 1rem" }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.2rem 0.625rem",
                          background: isActive
                            ? "rgba(5,150,105,0.07)"
                            : "rgba(239,68,68,0.07)",
                          border: `1px solid ${
                            isActive
                              ? "rgba(5,150,105,0.15)"
                              : "rgba(239,68,68,0.15)"
                          }`,
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: isActive ? "#059669" : "#ef4444",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        padding: "0.875rem 1rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <EmployeeActionsMenu
                          employee={employee}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onAddSalary={onAddSalary}
                          onViewSalaryHistory={onViewSalaryHistory}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && employees.length > 0 && <Pagination {...pagination} total={employees.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />}
    </div>
  );
}
