"use client";

import { useEffect, useState } from "react";
import {
  X, Plus, Receipt, Tag, CalendarDays, DollarSign, ClipboardList, FileText,
  AlertCircle, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Expense } from "@/types/expense";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut, labelStyle, textareaBase } from "@/lib/ui";
import { useDialog } from "@/hooks/useDialog";
import { getErrorMessage } from "@/lib/errors";

interface Props {
  open: boolean;
  onClose: () => void;
  expense: Expense;
  refreshExpenses: () => void;
}

const CATEGORY_OPTIONS = ["Travel", "Office Supplies", "Utilities", "Software", "Maintenance", "Other"];
const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

export default function ExpenseModal({ open, onClose, expense, refreshExpenses }: Props) {
  const isEdit = !!expense.id;
  const [form, setForm] = useState<Expense>(expense);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestClose = () => {
    if (!loading) onClose();
  };
  const dialogRef = useDialog<HTMLDivElement>(open, requestClose);

  useEffect(() => {
    if (!open) return;
    setForm(expense);
    setError("");
  }, [open, expense]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.title.trim()) { setError("Expense title is required."); return; }
    if (!form.category) { setError("Please select a category."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Amount must be a positive number."); return; }
    if (!form.date) { setError("Date is required."); return; }
    if (!form.status) { setError("Please select a status."); return; }

    setLoading(true);
    setError("");
    try {
      const url = isEdit ? "/api/expenses/update" : "/api/expenses/create";
      const method = isEdit ? "PUT" : "POST";
      const body = {
        ...(isEdit ? { id: form.id } : {}),
        title: form.title,
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        status: form.status,
        notes: form.notes,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save expense.");
      toast.success(isEdit ? "Expense updated successfully!" : "Expense created successfully!");
      refreshExpenses();
      onClose();
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save expense.");
      setError(message);
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        tabIndex={-1}
        className="animate-slideUp w-full overflow-y-auto"
        style={{ maxWidth: "560px", maxHeight: "95vh", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
      >
        {/* Gradient header */}
        <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "1.25rem 1.25rem 0 0", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h2 id="expense-modal-title" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              {isEdit ? "Edit Expense" : "Add Expense"}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>
              {isEdit ? "Update this expense record" : "Log a new company expense"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close expense form"
            onClick={requestClose}
            disabled={loading}
            style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: loading ? "not-allowed" : "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd", opacity: loading ? 0.55 : 1 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} aria-describedby={error ? "expense-form-error" : undefined} style={{ padding: "1.75rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Error */}
          {error && (
            <div id="expense-form-error" role="alert" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="expense-title" style={labelStyle}>Title <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={inputWrap}>
              <Receipt size={14} style={iconStyle} />
              <input
                id="expense-title"
                type="text" name="title" placeholder="e.g. Client dinner"
                value={form.title} onChange={handleChange} required
                aria-invalid={!!error && !form.title.trim()}
                aria-describedby={error && !form.title.trim() ? "expense-form-error" : undefined}
                style={inputBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>

          {/* Category + Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="expense-category" style={labelStyle}>Category <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <Tag size={14} style={iconStyle} />
                <select
                  id="expense-category"
                  name="category" value={form.category} onChange={handleChange}
                  aria-invalid={!!error && !form.category}
                  aria-describedby={error && !form.category ? "expense-form-error" : undefined}
                  style={{ ...inputBase, paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
                  onFocus={focusIn} onBlur={focusOut}
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="expense-amount" style={labelStyle}>Amount <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <DollarSign size={14} style={iconStyle} />
                <input
                  id="expense-amount"
                  type="number" name="amount" placeholder="0.00" min="0.01" step="0.01"
                  value={form.amount} onChange={handleChange} required
                  aria-invalid={!!error && (!form.amount || Number(form.amount) <= 0)}
                  aria-describedby={error && (!form.amount || Number(form.amount) <= 0) ? "expense-form-error" : undefined}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {/* Date + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="expense-date" style={labelStyle}>Date <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <CalendarDays size={14} style={iconStyle} />
                <input
                  id="expense-date"
                  type="date" name="date" value={form.date} onChange={handleChange} required
                  aria-invalid={!!error && !form.date}
                  aria-describedby={error && !form.date ? "expense-form-error" : undefined}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>

            <div>
              <label htmlFor="expense-status" style={labelStyle}>Status <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <ClipboardList size={14} style={iconStyle} />
                <select
                  id="expense-status"
                  name="status" value={form.status} onChange={handleChange}
                  aria-invalid={!!error && !form.status}
                  aria-describedby={error && !form.status ? "expense-form-error" : undefined}
                  style={{ ...inputBase, paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
                  onFocus={focusIn} onBlur={focusOut}
                >
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="expense-notes" style={labelStyle}>Notes</label>
            <div style={{ position: "relative" }}>
              <FileText size={14} style={{ ...iconStyle, top: "1.05rem" }} />
              <textarea
                id="expense-notes"
                name="notes" placeholder="Optional notes…"
                value={form.notes || ""} onChange={handleChange} rows={3}
                style={textareaBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#f0f2f8" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button" onClick={requestClose} disabled={loading}
              style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 600, borderRadius: "0.625rem", border: "1.5px solid #e2e8f0", background: "#f8faff", color: "#475569", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.625rem", border: "none", background: loading ? "#818cf8" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", opacity: loading ? 0.75 : 1 }}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                : isEdit
                ? "Update Expense"
                : <><Plus size={15} /> Add Expense</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
