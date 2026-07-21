"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { SalaryRecord } from "@/types/salary";
import { emptySalaryFor } from "@/lib/salary";
import SalaryModal from "@/components/salary/SalaryModal";
import DeleteSalaryModal from "@/components/salary/DeleteSalaryModal";
import SalaryTable from "@/components/salary/SalaryTable";

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

            <SalaryTable
              records={records}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showEmployeeColumn={false}
            />
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
