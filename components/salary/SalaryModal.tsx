"use client";

import { useEffect, useState } from "react";
import {
  X, Plus, User, CalendarDays, DollarSign, ClipboardList, FileText, Wallet,
  AlertCircle, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { SalaryRecord } from "@/types/salary";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut, labelStyle, textareaBase } from "@/lib/ui";
import { useDialog } from "@/hooks/useDialog";
import { useRemoteList } from "@/hooks/useRemoteList";
import { getErrorMessage } from "@/lib/errors";

interface EmployeeOption {
  id?: string;
  name: string;
  basicSalary?: number | "";
}

interface Props {
  open: boolean;
  onClose: () => void;
  salary: SalaryRecord;
  refreshSalary: () => void;
  allowEmployeeSelect?: boolean;
}

const STATUS_OPTIONS = ["Pending", "Paid"];

export default function SalaryModal({ open, onClose, salary, refreshSalary, allowEmployeeSelect }: Props) {
  const isEdit = !!salary.id;
  const showEmployeePicker = !!allowEmployeeSelect && !isEdit;
  const [form, setForm] = useState<SalaryRecord>(salary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestClose = () => {
    if (!loading) onClose();
  };
  const dialogRef = useDialog<HTMLDivElement>(open, requestClose);

  const {
    items: employees,
    loading: empLoading,
    error: empError,
    retry: retryEmployees,
  } = useRemoteList<EmployeeOption>({
    open,
    enabled: showEmployeePicker,
    url: "/api/employees/list",
    errorMessage: "Employees could not be loaded.",
  });

  useEffect(() => {
    if (!open) return;
    setForm(salary);
    setError("");
  }, [open, salary]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "employeeId") {
      const selected = employees.find((emp) => emp.id === value);
      setForm((prev) => ({
        ...prev,
        employeeId: value,
        employeeName: selected?.name || "",
        basicSalary: selected?.basicSalary || "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const netSalary =
    (Number(form.basicSalary) || 0) +
    (Number(form.allowances) || 0) +
    (Number(form.bonus) || 0) -
    (Number(form.deductions) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showEmployeePicker && !form.employeeId) { setError("Please select an employee."); return; }
    if (!isEdit && !form.month) { setError("Month is required."); return; }
    if (!form.basicSalary || Number(form.basicSalary) <= 0) { setError("Basic salary must be a positive number."); return; }
    if (!form.status) { setError("Please select a status."); return; }
    if (form.status === "Paid" && !form.paymentDate) { setError("Payment date is required when salary is marked paid."); return; }

    setLoading(true);
    setError("");
    try {
      const url = isEdit ? "/api/salary/update" : "/api/salary/create";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? {
            id: form.id,
            basicSalary: form.basicSalary,
            allowances: form.allowances,
            deductions: form.deductions,
            bonus: form.bonus,
            status: form.status,
            paymentDate: form.paymentDate,
            notes: form.notes,
          }
        : {
            employeeId: form.employeeId,
            employeeName: form.employeeName,
            month: form.month,
            basicSalary: form.basicSalary,
            allowances: form.allowances,
            deductions: form.deductions,
            bonus: form.bonus,
            status: form.status,
            paymentDate: form.paymentDate,
            notes: form.notes,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save salary record.");
      toast.success(isEdit ? "Salary record updated!" : "Salary added successfully!");
      refreshSalary();
      onClose();
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save salary record.");
      setError(message);
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="salary-modal-title"
        tabIndex={-1}
        className="animate-slideUp w-full overflow-y-auto"
        style={{ maxWidth: "560px", maxHeight: "95vh", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
      >
        {/* Gradient header */}
        <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "1.25rem 1.25rem 0 0", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h2 id="salary-modal-title" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              {isEdit ? "Edit Salary Record" : "Add Salary"}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>
              {form.employeeName || "Select an employee below"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close salary form"
            onClick={requestClose}
            disabled={loading}
            style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: loading ? "not-allowed" : "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd", opacity: loading ? 0.55 : 1 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} aria-describedby={error ? "salary-form-error" : undefined} style={{ padding: "1.75rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Error */}
          {error && (
            <div id="salary-form-error" role="alert" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
              <span>{error}</span>
            </div>
          )}

          {/* Employee */}
          {showEmployeePicker && (
            <div>
              <label htmlFor="salary-employee" style={labelStyle}>Employee <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <User size={14} style={iconStyle} />
                <select
                  id="salary-employee"
                  name="employeeId" value={form.employeeId} onChange={handleChange}
                  disabled={empLoading}
                  aria-invalid={!!error && !form.employeeId}
                  aria-describedby={[
                    error && !form.employeeId ? "salary-form-error" : "",
                    empError ? "salary-employees-error" : "",
                  ].filter(Boolean).join(" ") || undefined}
                  style={{ ...inputBase, paddingRight: "2.5rem", appearance: "none", cursor: empLoading ? "not-allowed" : "pointer", opacity: empLoading ? 0.7 : 1 }}
                  onFocus={focusIn} onBlur={focusOut}
                >
                  <option value="">{empError ? "Employees unavailable" : empLoading ? "Loading employees…" : "Select Employee"}</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              {empError && (
                <div id="salary-employees-error" role="alert" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginTop: "0.5rem", color: "#dc2626", fontSize: "0.75rem" }}>
                  <span>{empError}</span>
                  <button type="button" onClick={retryEmployees} style={{ border: "none", background: "transparent", color: "#4f46e5", font: "inherit", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Month */}
          <div>
            <label htmlFor="salary-month" style={labelStyle}>Month <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={inputWrap}>
              <CalendarDays size={14} style={iconStyle} />
              <input
                id="salary-month"
                type="month" name="month" value={form.month} onChange={handleChange}
                disabled={isEdit} required
                aria-invalid={!!error && !form.month}
                aria-describedby={error && !form.month ? "salary-form-error" : undefined}
                style={{ ...inputBase, cursor: isEdit ? "not-allowed" : "text", opacity: isEdit ? 0.7 : 1 }}
                onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>

          {/* Basic Salary + Allowances */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="salary-basic" style={labelStyle}>Basic Salary <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <DollarSign size={14} style={iconStyle} />
                <input
                  id="salary-basic"
                  type="number" name="basicSalary" placeholder="0.00" min="0.01" step="0.01"
                  value={form.basicSalary} onChange={handleChange} required
                  aria-invalid={!!error && (!form.basicSalary || Number(form.basicSalary) <= 0)}
                  aria-describedby={error && (!form.basicSalary || Number(form.basicSalary) <= 0) ? "salary-form-error" : undefined}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
            <div>
              <label htmlFor="salary-allowances" style={labelStyle}>Allowances</label>
              <div style={inputWrap}>
                <DollarSign size={14} style={iconStyle} />
                <input
                  id="salary-allowances"
                  type="number" name="allowances" placeholder="0.00" min="0" step="0.01"
                  value={form.allowances} onChange={handleChange}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {/* Deductions + Bonus */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="salary-deductions" style={labelStyle}>Deductions</label>
              <div style={inputWrap}>
                <DollarSign size={14} style={iconStyle} />
                <input
                  id="salary-deductions"
                  type="number" name="deductions" placeholder="0.00" min="0" step="0.01"
                  value={form.deductions} onChange={handleChange}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
            <div>
              <label htmlFor="salary-bonus" style={labelStyle}>Bonus</label>
              <div style={inputWrap}>
                <DollarSign size={14} style={iconStyle} />
                <input
                  id="salary-bonus"
                  type="number" name="bonus" placeholder="0.00" min="0" step="0.01"
                  value={form.bonus} onChange={handleChange}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {/* Net salary preview */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(99,102,241,0.06)", border: "1.5px solid rgba(99,102,241,0.15)", borderRadius: "0.625rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", fontWeight: 600, color: "#4f46e5" }}>
              <Wallet size={14} /> Net Salary
            </span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "#4f46e5" }}>
              {netSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Status + Payment Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="salary-status" style={labelStyle}>Status <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <ClipboardList size={14} style={iconStyle} />
                <select
                  id="salary-status"
                  name="status" value={form.status} onChange={handleChange}
                  aria-invalid={!!error && !form.status}
                  aria-describedby={error && !form.status ? "salary-form-error" : undefined}
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
            <div>
              <label htmlFor="salary-payment-date" style={labelStyle}>Payment Date</label>
              <div style={inputWrap}>
                <CalendarDays size={14} style={iconStyle} />
                <input
                  id="salary-payment-date"
                  type="date" name="paymentDate" value={form.paymentDate || ""} onChange={handleChange}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="salary-notes" style={labelStyle}>Notes</label>
            <div style={{ position: "relative" }}>
              <FileText size={14} style={{ ...iconStyle, top: "1.05rem" }} />
              <textarea
                id="salary-notes"
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
                ? "Update Salary"
                : <><Plus size={15} /> Add Salary</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
