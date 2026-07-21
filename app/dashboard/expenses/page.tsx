"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseModal from "@/components/expenses/ExpenseModal";
import DeleteExpenseModal from "@/components/expenses/DeleteExpenseModal";
import { Expense } from "@/types/expense";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";

const emptyExpense: Expense = { id: "", title: "", category: "", amount: "", date: "", status: "Pending", notes: "" };

const CATEGORY_OPTIONS = ["Travel", "Office Supplies", "Utilities", "Software", "Maintenance", "Other"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense>(emptyExpense);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/expenses/list");
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleAdd = () => { setEditingExpense(emptyExpense); setOpenModal(true); };
  const handleEdit = (expense: Expense) => { setEditingExpense(expense); setOpenModal(true); };
  const handleDelete = (expense: Expense) => { setSelectedExpense(expense); setDeleteModal(true); };

  const totalAmount    = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const pendingCount   = expenses.filter((e) => e.status === "Pending").length;
  const approvedCount  = expenses.filter((e) => e.status === "Approved").length;
  const rejectedCount  = expenses.filter((e) => e.status === "Rejected").length;

  const filteredExpenses = useMemo(() => {
    const keyword = search.toLowerCase();
    return expenses.filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(keyword);
      const matchesCategory = categoryFilter === "" || expense.category === categoryFilter;
      const matchesStatus = statusFilter === "" || expense.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [expenses, search, categoryFilter, statusFilter]);

  return (
    <div className="page-root">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Expense Management</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>Track and manage company expenses</p>
        </div>
        <button
          onClick={handleAdd}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Spent",  value: totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: "🧾", color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.15)" },
          { label: "Pending",      value: pendingCount,  icon: "⏳", color: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.15)"  },
          { label: "Approved",     value: approvedCount, icon: "✅", color: "#059669", bg: "rgba(5,150,105,0.08)",  border: "rgba(5,150,105,0.15)"  },
          { label: "Rejected",     value: rejectedCount, icon: "⛔", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: "1.625rem", fontWeight: 800, color: s.color, lineHeight: 1, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</p>
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
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputBase}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ ...inputBase, paddingLeft: "0.875rem", paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▾</span>
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputBase, paddingLeft: "0.875rem", paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <span style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▾</span>
        </div>
      </div>

      {/* Table */}
      <ExpenseTable expenses={filteredExpenses} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modals */}
      <ExpenseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        expense={editingExpense}
        refreshExpenses={fetchExpenses}
      />
      <DeleteExpenseModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        expense={selectedExpense}
        refreshExpenses={fetchExpenses}
      />
    </div>
  );
}
