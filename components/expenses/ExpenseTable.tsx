"use client";

import { Pencil, Trash2, Receipt } from "lucide-react";
import { Expense } from "@/types/expense";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import ActionsMenu from "@/components/ActionsMenu";

interface Props {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const statusMeta: Record<string, { color: string; bg: string; border: string }> = {
  Pending:  { color: "#d97706", bg: "rgba(217,119,6,0.07)", border: "rgba(217,119,6,0.15)" },
  Approved: { color: "#059669", bg: "rgba(5,150,105,0.07)", border: "rgba(5,150,105,0.15)" },
  Rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.15)" },
};

const defaultMeta = { color: "#6366f1", bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.15)" };

function formatAmount(amount: number | "") {
  const n = Number(amount) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }: Props) {
  const pagination = usePagination(expenses);
  return (
    <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8ecf4", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid #f0f2f8", background: "#fafbff" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>All Expenses</h2>
        {!loading && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", background: "#f1f5f9", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600 }}>
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading expenses…</p>
        </div>
      ) : expenses.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "0.75rem" }}>
          <Receipt size={48} color="#e2e8f0" />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>No expenses yet</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>Click "Add Expense" to log the first one.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "680px" }}>
            <thead>
              <tr style={{ background: "#f8faff", borderBottom: "1px solid #f0f2f8" }}>
                {[
                  { label: "Title",    hide: "" },
                  { label: "Category", hide: "md" },
                  { label: "Date",     hide: "sm" },
                  { label: "Amount",   hide: "" },
                  { label: "Status",   hide: "" },
                  { label: "Actions",  hide: "" },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={col.hide ? `hidden ${col.hide}:table-cell` : ""}
                    style={{ padding: "0.875rem 1rem", textAlign: col.label === "Actions" || col.label === "Amount" ? (col.label === "Actions" ? "center" : "right") : "left", fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagination.pageItems.map((expense, i) => {
                const meta = statusMeta[expense.status] ?? defaultMeta;

                return (
                  <tr
                    key={expense.id}
                    style={{ borderBottom: i < expenses.length - 1 ? "1px solid #f0f2f8" : "none", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Title */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: "#6366f1" }}>
                          {expense.title?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>{expense.title}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="hidden md:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                      {expense.category || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>

                    {/* Date */}
                    <td className="hidden sm:table-cell" style={{ padding: "0.875rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                      {expense.date}
                    </td>

                    {/* Amount */}
                    <td style={{ padding: "0.875rem 1rem", textAlign: "right", fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>
                      {formatAmount(expense.amount)}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: meta.color, whiteSpace: "nowrap" }}>
                        {expense.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                      <div className="flex justify-center"><ActionsMenu details={{ title: expense.title || "Expense", data: expense }} items={[{ label: "Edit", icon: Pencil, onClick: () => onEdit(expense) }, { label: "Delete", icon: Trash2, danger: true, onClick: () => onDelete(expense) }]} /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && expenses.length > 0 && <Pagination {...pagination} total={expenses.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />}
    </div>
  );
}
