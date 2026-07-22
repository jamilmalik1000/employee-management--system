"use client";

import { Pencil, Trash2, Wallet } from "lucide-react";
import { SalaryRecord } from "@/types/salary";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import ActionsMenu from "@/components/ActionsMenu";

interface Props {
  records: SalaryRecord[];
  loading: boolean;
  onEdit: (record: SalaryRecord) => void;
  onDelete: (record: SalaryRecord) => void;
  showEmployeeColumn?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const statusMeta: Record<string, { color: string; bg: string; border: string }> = {
  Paid:    { color: "var(--status-success-text)", bg: "rgba(5,150,105,0.1)", border: "rgba(5,150,105,0.22)" },
  Pending: { color: "var(--status-warning-text)", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.22)" },
};
const defaultMeta = { color: "var(--color-primary-text)", bg: "var(--color-primary-soft)", border: "rgba(var(--color-primary-rgb),0.2)" };

export function formatAmount(amount?: number) {
  return (amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SalaryTable({ records, loading, onEdit, onDelete, showEmployeeColumn = true, emptyTitle = "No salary records yet", emptyDescription = 'Click "Add Salary" to log the first payment.' }: Props) {
  const pagination = usePagination(records);
  const columns = [
    ...(showEmployeeColumn ? ["Employee"] : []),
    "Month", "Basic", "Allowances", "Deductions", "Bonus", "Net", "Status", "Paid On", "Actions",
  ];
  const rightAlign = ["Basic", "Allowances", "Deductions", "Bonus", "Net"];
  const desktopOnly = ["Basic", "Allowances", "Deductions", "Bonus"];

  return (
    <div style={{ background: "var(--color-bg-surface)", borderRadius: "1rem", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface-alt)" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Salary Records</h2>
        {!loading && (
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", background: "var(--color-border)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
            {records.length} {records.length === 1 ? "record" : "records"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", border: "3px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Loading salary records…</p>
        </div>
      ) : records.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <Wallet size={40} color="var(--color-border-strong)" />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-text-secondary)", margin: 0 }}>{emptyTitle}</p>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", margin: 0 }}>{emptyDescription}</p>
        </div>
      ) : (
        <div className="table-scroll-region" role="region" aria-label="Salary table, scroll horizontally for more columns" tabIndex={0} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: showEmployeeColumn ? "580px" : "500px" }}>
            <thead>
              <tr style={{ background: "var(--color-bg-surface-alt)", borderBottom: "1px solid var(--color-border)" }}>
                {columns.map((label) => (
                  <th
                    key={label}
                    className={desktopOnly.includes(label) ? "hidden lg:table-cell" : label === "Paid On" ? "hidden xl:table-cell" : ""}
                    style={{ padding: "0.75rem 0.875rem", textAlign: label === "Actions" ? "center" : rightAlign.includes(label) ? "right" : "left", fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagination.pageItems.map((record, i) => {
                const meta = statusMeta[record.status] ?? defaultMeta;
                return (
                  <tr key={record.id} style={{ borderBottom: i < records.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    {showEmployeeColumn && (
                      <td style={{ padding: "0.75rem 0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: "var(--gradient-identity)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                            {record.employeeName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{record.employeeName}</span>
                        </div>
                      </td>
                    )}
                    <td style={{ padding: "0.75rem 0.875rem", fontWeight: 600, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{record.month}</td>
                    <td className="hidden lg:table-cell" style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{formatAmount(Number(record.basicSalary))}</td>
                    <td className="hidden lg:table-cell" style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{formatAmount(Number(record.allowances))}</td>
                    <td className="hidden lg:table-cell" style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{formatAmount(Number(record.deductions))}</td>
                    <td className="hidden lg:table-cell" style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{formatAmount(Number(record.bonus))}</td>
                    <td style={{ padding: "0.75rem 0.875rem", textAlign: "right", fontWeight: 700, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{formatAmount(record.netSalary)}</td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: meta.color, whiteSpace: "nowrap" }}>
                        {record.status}
                      </span>
                    </td>
                    <td className="hidden xl:table-cell" style={{ padding: "0.75rem 0.875rem", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                      {record.paymentDate || <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                    </td>
                    <td style={{ padding: "0.75rem 0.875rem", textAlign: "center" }}>
                      <div className="flex justify-center"><ActionsMenu details={{ title: `${record.employeeName || "Salary"} · ${record.month}`, data: record }} items={[{ label: "Edit", icon: Pencil, onClick: () => onEdit(record) }, { label: "Delete", icon: Trash2, danger: true, onClick: () => onDelete(record) }]} /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && records.length > 0 && <Pagination {...pagination} total={records.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />}
    </div>
  );
}
