"use client";

import { Pencil, Trash2, CalendarCheck } from "lucide-react";
import { Attendance } from "@/types/attendance";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import ActionsMenu from "@/components/ActionsMenu";

interface Props {
  attendance: Attendance[];
  loading: boolean;
  onEdit?: (record: Attendance) => void;
  onDelete?: (record: Attendance) => void;
  readOnly?: boolean;
}

const statusMeta: Record<string, { color: string; bg: string; border: string }> = {
  Present:  { color: "#059669", bg: "rgba(5,150,105,0.07)",  border: "rgba(5,150,105,0.15)" },
  Absent:   { color: "#ef4444", bg: "rgba(239,68,68,0.07)",  border: "rgba(239,68,68,0.15)" },
  Late:     { color: "#d97706", bg: "rgba(217,119,6,0.07)",  border: "rgba(217,119,6,0.15)" },
  "Half Day": { color: "#7c3aed", bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.15)" },
  Leave:    { color: "#2563eb", bg: "rgba(37,99,235,0.07)",  border: "rgba(37,99,235,0.15)" },
};

const defaultMeta = { color: "#6366f1", bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.15)" };

export default function AttendanceTable({ attendance, loading, onEdit, onDelete, readOnly }: Props) {
  const pagination = usePagination(attendance);
  return (
    <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8ecf4", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid #f0f2f8", background: "#fafbff" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Attendance Records</h2>
        {!loading && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
            {attendance.length} {attendance.length === 1 ? "record" : "records"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading attendance…</p>
        </div>
      ) : attendance.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <CalendarCheck size={48} color="#e2e8f0" />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>No attendance records</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>
            {readOnly ? "Your attendance history will show up here." : 'Click "Add Attendance" to mark the first record.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "640px" }}>
            <thead>
              <tr style={{ background: "#f8faff", borderBottom: "1px solid #f0f2f8" }}>
                {[
                  { label: "Employee",  hide: "" },
                  { label: "Date",      hide: "" },
                  { label: "Status",    hide: "" },
                  { label: "Check In",  hide: "sm" },
                  { label: "Check Out", hide: "sm" },
                  { label: "Remarks",   hide: "md" },
                  ...(readOnly ? [] : [{ label: "Actions", hide: "" }]),
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
              {pagination.pageItems.map((record, i) => {
                const meta = statusMeta[record.status] ?? defaultMeta;

                return (
                  <tr
                    key={record.id}
                    style={{ borderBottom: i < attendance.length - 1 ? "1px solid #f0f2f8" : "none", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Employee */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: "#6366f1" }}>
                          {record.employeeName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>{record.employeeName}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: "0.875rem 1rem", color: "#475569", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {record.date}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: meta.color, whiteSpace: "nowrap" }}>
                        {record.status}
                      </span>
                    </td>

                    {/* Check In */}
                    <td className="hidden sm:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                      {record.checkIn || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>

                    {/* Check Out */}
                    <td className="hidden sm:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                      {record.checkOut || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>

                    {/* Remarks */}
                    <td className="hidden md:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {record.remarks || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>

                    {/* Actions */}
                    {!readOnly && (
                      <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                        <div className="flex justify-center"><ActionsMenu details={{ title: `${record.employeeName} · ${record.date}`, data: record }} items={[{ label: "Edit", icon: Pencil, onClick: () => onEdit?.(record) }, { label: "Delete", icon: Trash2, danger: true, onClick: () => onDelete?.(record) }]} /></div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && attendance.length > 0 && <Pagination {...pagination} total={attendance.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />}
    </div>
  );
}
