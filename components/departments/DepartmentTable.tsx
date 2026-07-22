"use client";

import { Pencil, Trash2, Building2 } from "lucide-react";
import { Department } from "@/types/department";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import ActionsMenu from "@/components/ActionsMenu";

interface Props {
  departments: Department[];
  loading: boolean;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export default function DepartmentTable({ departments, loading, onEdit, onDelete }: Props) {
  const pagination = usePagination(departments);
  return (
    <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8ecf4", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid #f0f2f8", background: "#fafbff" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>All Departments</h2>
        {!loading && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
            {departments.length} {departments.length === 1 ? "department" : "departments"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading departments…</p>
        </div>
      ) : departments.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <Building2 size={48} color="#e2e8f0" />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>No departments yet</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>Click "Add Department" to create the first one.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "640px" }}>
            <thead>
              <tr style={{ background: "#f8faff", borderBottom: "1px solid #f0f2f8" }}>
                {[
                  { label: "Department", hide: "" },
                  { label: "Description", hide: "md" },
                  { label: "Status",      hide: "sm" },
                  { label: "Actions",     hide: "" },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={col.hide ? `hidden ${col.hide}:table-cell` : ""}
                    style={{ padding: "0.875rem 1rem", textAlign: col.label === "Actions" ? "center" : "left", fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagination.pageItems.map((dept, i) => {
                const isActive = dept.isActive ?? false;

                return (
                  <tr
                    key={dept.id}
                    style={{ borderBottom: i < departments.length - 1 ? "1px solid #f0f2f8" : "none", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Name */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: "#6366f1" }}>
                          {dept.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>{dept.name}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="hidden md:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {dept.description || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>

                    {/* Status badge */}
                    <td className="hidden sm:table-cell" style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", background: isActive ? "rgba(5,150,105,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${isActive ? "rgba(5,150,105,0.15)" : "rgba(239,68,68,0.15)"}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: isActive ? "#059669" : "#ef4444", whiteSpace: "nowrap" }}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                      <div className="flex justify-center"><ActionsMenu details={{ title: dept.name || "Department", data: dept }} items={[{ label: "Edit", icon: Pencil, onClick: () => onEdit(dept) }, { label: "Delete", icon: Trash2, danger: true, onClick: () => onDelete(dept) }]} /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && departments.length > 0 && <Pagination {...pagination} total={departments.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />}
    </div>
  );
}
