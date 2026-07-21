"use client";

import { useEffect, useState } from "react";
import { X, Plus, Pencil, Trash2, Wallet } from "lucide-react";
import { SalaryRecord } from "@/types/salary";
import { emptySalaryFor } from "@/lib/salary";
import SalaryModal from "@/components/salary/SalaryModal";
import DeleteSalaryModal from "@/components/salary/DeleteSalaryModal";

interface EmployeeRef {
  id?: string;
  name: string;
  basicSalary?: number | "";
}

interface Props {
  open: boolean;
  onClose: () => void;
  employee: EmployeeRef | null;
}

const statusMeta: Record<string, { color: string; bg: string; border: string }> = {
  Paid:    { color: "#059669", bg: "rgba(5,150,105,0.07)", border: "rgba(5,150,105,0.15)" },
  Pending: { color: "#d97706", bg: "rgba(217,119,6,0.07)", border: "rgba(217,119,6,0.15)" },
};
const defaultMeta = { color: "#6366f1", bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.15)" };

function formatAmount(amount?: number) {
  return (amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SalaryHistoryModal({ open, onClose, employee }: Props) {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryRecord | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);

  const fetchRecords = async () => {
    if (!employee?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/salary/list?employeeId=${encodeURIComponent(employee.id)}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && employee) fetchRecords();
  }, [open, employee]);

  if (!open || !employee) return null;

  const handleAdd = () => { setEditingSalary(emptySalaryFor(employee)); setSalaryModalOpen(true); };
  const handleEdit = (record: SalaryRecord) => { setEditingSalary(record); setSalaryModalOpen(true); };
  const handleDelete = (record: SalaryRecord) => { setSelectedSalary(record); setDeleteModalOpen(true); };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="animate-slideUp w-full overflow-y-auto"
          style={{ maxWidth: "760px", maxHeight: "90vh", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
        >
          {/* Gradient header */}
          <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "1.25rem 1.25rem 0 0", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>Salary History</h2>
              <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>{employee.name}</p>
            </div>
            <button
              onClick={onClose}
              style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "1.5rem 2rem 2rem" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button
                onClick={handleAdd}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.125rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: "0.8125rem", fontWeight: 700, borderRadius: "0.625rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
              >
                <Plus size={14} /> Add Salary
              </button>
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3.5rem 1rem", gap: "0.75rem" }}>
                <div style={{ width: "2.25rem", height: "2.25rem", border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading salary history…</p>
              </div>
            ) : records.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3.5rem 1rem", gap: "0.75rem" }}>
                <Wallet size={40} color="#e2e8f0" />
                <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>No salary records yet</p>
                <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>Click "Add Salary" to log the first payment.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto", border: "1px solid #e8ecf4", borderRadius: "0.875rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "620px" }}>
                  <thead>
                    <tr style={{ background: "#f8faff", borderBottom: "1px solid #f0f2f8" }}>
                      {["Month", "Basic", "Allowances", "Deductions", "Bonus", "Net", "Status", "Paid On", "Actions"].map((label) => (
                        <th
                          key={label}
                          style={{ padding: "0.75rem 0.875rem", textAlign: label === "Actions" ? "center" : ["Basic", "Allowances", "Deductions", "Bonus", "Net"].includes(label) ? "right" : "left", fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, i) => {
                      const meta = statusMeta[record.status] ?? defaultMeta;
                      return (
                        <tr key={record.id} style={{ borderBottom: i < records.length - 1 ? "1px solid #f0f2f8" : "none" }}>
                          <td style={{ padding: "0.75rem 0.875rem", fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap" }}>{record.month}</td>
                          <td style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "#64748b", whiteSpace: "nowrap" }}>{formatAmount(Number(record.basicSalary))}</td>
                          <td style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "#64748b", whiteSpace: "nowrap" }}>{formatAmount(Number(record.allowances))}</td>
                          <td style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "#64748b", whiteSpace: "nowrap" }}>{formatAmount(Number(record.deductions))}</td>
                          <td style={{ padding: "0.75rem 0.875rem", textAlign: "right", color: "#64748b", whiteSpace: "nowrap" }}>{formatAmount(Number(record.bonus))}</td>
                          <td style={{ padding: "0.75rem 0.875rem", textAlign: "right", fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>{formatAmount(record.netSalary)}</td>
                          <td style={{ padding: "0.75rem 0.875rem" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.625rem", background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, color: meta.color, whiteSpace: "nowrap" }}>
                              {record.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 0.875rem", color: "#64748b", whiteSpace: "nowrap" }}>
                            {record.paymentDate || <span style={{ color: "#cbd5e1" }}>—</span>}
                          </td>
                          <td style={{ padding: "0.75rem 0.875rem", textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                              <button onClick={() => handleEdit(record)} title="Edit record" style={{ width: "1.875rem", height: "1.875rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.07)", color: "#6366f1", cursor: "pointer" }}>
                                <Pencil size={12} />
                              </button>
                              <button onClick={() => handleDelete(record)} title="Delete record" style={{ width: "1.875rem", height: "1.875rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.07)", color: "#ef4444", cursor: "pointer" }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested modals — layered above this one */}
      {editingSalary && (
        <SalaryModal
          open={salaryModalOpen}
          onClose={() => setSalaryModalOpen(false)}
          salary={editingSalary}
          refreshSalary={fetchRecords}
        />
      )}
      <DeleteSalaryModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        salary={selectedSalary}
        refreshSalary={fetchRecords}
      />
    </>
  );
}
