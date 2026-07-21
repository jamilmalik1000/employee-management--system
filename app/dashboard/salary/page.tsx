"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import SalaryTable from "@/components/salary/SalaryTable";
import SalaryModal from "@/components/salary/SalaryModal";
import DeleteSalaryModal from "@/components/salary/DeleteSalaryModal";
import { SalaryRecord } from "@/types/salary";
import { emptySalary } from "@/lib/salary";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";

export default function SalaryPage() {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryRecord | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/salary/list");
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleAdd = () => { setEditingSalary(emptySalary()); setSalaryModalOpen(true); };
  const handleEdit = (record: SalaryRecord) => { setEditingSalary(record); setSalaryModalOpen(true); };
  const handleDelete = (record: SalaryRecord) => { setSelectedSalary(record); setDeleteModalOpen(true); };

  const totalPayroll  = records.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0);
  const paidCount     = records.filter((r) => r.status === "Paid").length;
  const pendingCount  = records.filter((r) => r.status === "Pending").length;
  const employeeCount = new Set(records.map((r) => r.employeeId).filter(Boolean)).size;

  const filteredRecords = useMemo(() => {
    const keyword = search.toLowerCase();
    return records.filter((record) => {
      const matchesSearch = record.employeeName.toLowerCase().includes(keyword);
      const matchesMonth = monthFilter === "" || record.month === monthFilter;
      const matchesStatus = statusFilter === "" || record.status === statusFilter;
      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [records, search, monthFilter, statusFilter]);

  return (
    <div className="page-root">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--color-text-primary)", margin: 0 }}>Salary Management</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>Add and track employee salary payments</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn btn-primary"
          style={{ padding: "0.75rem 1.25rem" }}
        >
          <Plus size={16} />
          Add Salary
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Payroll", value: totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: "💰", color: "var(--color-primary)", bg: "var(--color-primary-soft)", border: "rgba(var(--color-primary-rgb),0.18)" },
          { label: "Paid",          value: paidCount,     icon: "✅", color: "#059669", bg: "rgba(5,150,105,0.08)",  border: "rgba(5,150,105,0.15)"  },
          { label: "Pending",       value: pendingCount,  icon: "⏳", color: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.15)"  },
          { label: "Employees Paid", value: employeeCount, icon: "👥", color: "var(--color-accent)", bg: "var(--color-accent-soft)", border: "rgba(var(--color-accent-rgb),0.2)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: "1.625rem", fontWeight: 800, color: s.color, lineHeight: 1, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{ padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.875rem", alignItems: "center" }}
      >
        <div style={inputWrap}>
          <Search size={14} style={iconStyle} />
          <input
            type="text"
            placeholder="Search by employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputBase}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={{ ...inputBase, paddingLeft: "0.875rem" }}
          onFocus={focusIn}
          onBlur={focusOut}
        />

        <div style={{ position: "relative" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputBase, paddingLeft: "0.875rem", paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <span style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>▾</span>
        </div>
      </div>

      {/* Table */}
      <SalaryTable records={filteredRecords} loading={loading} onEdit={handleEdit} onDelete={handleDelete} showEmployeeColumn />

      {/* Modals */}
      {editingSalary && (
        <SalaryModal
          open={salaryModalOpen}
          onClose={() => setSalaryModalOpen(false)}
          salary={editingSalary}
          refreshSalary={fetchRecords}
          allowEmployeeSelect
        />
      )}
      <DeleteSalaryModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        salary={selectedSalary}
        refreshSalary={fetchRecords}
      />
    </div>
  );
}
