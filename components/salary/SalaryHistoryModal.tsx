"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Plus } from "lucide-react";
import { SalaryRecord } from "@/types/salary";
import { emptySalaryFor } from "@/lib/salary";
import SalaryModal from "@/components/salary/SalaryModal";
import DeleteSalaryModal from "@/components/salary/DeleteSalaryModal";
import SalaryTable from "@/components/salary/SalaryTable";
import { useDialog } from "@/hooks/useDialog";
import { LoadError } from "@/components/ui/AppState";

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

export default function SalaryHistoryModal({ open, onClose, employee }: Props) {
  const dialogRef = useDialog<HTMLDivElement>(open && employee !== null, onClose);
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryRecord | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    const employeeId = employee?.id;
    if (!open || !employeeId) {
      setLoading(false);
      if (open) setError("Salary history cannot be loaded because this employee has no identifier.");
      return;
    }

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/salary/list?employeeId=${encodeURIComponent(employeeId)}`, {
        signal: controller.signal,
      });
      const data: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data && typeof data === "object" && "message" in data && typeof data.message === "string"
          ? data.message
          : "Failed to fetch salary records.";
        throw new Error(message);
      }

      if (!Array.isArray(data) || !data.every((record) => record !== null && typeof record === "object" && !Array.isArray(record))) {
        throw new Error("The server returned an invalid salary history response.");
      }

      setRecords(data as SalaryRecord[]);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to fetch salary records.");
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  }, [employee?.id, open]);

  useEffect(() => {
    requestRef.current?.abort();
    setRecords([]);
    setError(null);
    setSalaryModalOpen(false);
    setEditingSalary(null);
    setDeleteModalOpen(false);
    setSelectedSalary(null);

    if (!open) {
      setLoading(false);
      return;
    }

    void fetchRecords();
    return () => requestRef.current?.abort();
  }, [employee?.id, fetchRecords, open]);

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
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="salary-history-modal-title"
          tabIndex={-1}
          className="animate-slideUp w-full"
          style={{ maxWidth: "760px", maxHeight: "calc(100dvh - 2rem)", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-bg-surface)", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
        >
          {/* Gradient header */}
          <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "1.25rem 1.25rem 0 0", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexShrink: 0 }}>
            <div>
              <h2 id="salary-history-modal-title" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>Salary History</h2>
              <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>{employee.name}</p>
            </div>
            <button
              type="button"
              aria-label="Close salary history"
              onClick={onClose}
              style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "1.5rem 2rem 2rem", minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button
                type="button"
                onClick={handleAdd}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.125rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: "0.8125rem", fontWeight: 700, borderRadius: "0.625rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
              >
                <Plus size={14} /> Add Salary
              </button>
            </div>

            {error ? (
              <LoadError message={error} onRetry={() => void fetchRecords()} />
            ) : (
              <SalaryTable
                records={records}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showEmployeeColumn={false}
              />
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
