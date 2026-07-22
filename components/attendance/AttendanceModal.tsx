"use client";

import { useEffect, useState } from "react";
import {
  X, Plus, User, CalendarDays, ClipboardList, Clock, FileText,
  AlertCircle, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Attendance } from "@/types/attendance";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut, labelStyle, textareaBase } from "@/lib/ui";

interface EmployeeOption {
  id?: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  attendance: Attendance;
  refreshAttendance: () => void;
}

const STATUS_OPTIONS = ["Present", "Absent", "Late", "Half Day", "Leave"];

export default function AttendanceModal({ open, onClose, attendance, refreshAttendance }: Props) {
  const isEdit = !!attendance.id;

  const [form, setForm] = useState<Attendance>(attendance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [empLoading, setEmpLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(attendance);
    setError("");
  }, [open, attendance]);

  useEffect(() => {
    if (!open) return;
    setEmpLoading(true);
    fetch("/api/employees/list")
      .then((r) => r.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch(() => setEmployees([]))
      .finally(() => setEmpLoading(false));
  }, [open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "employeeId") {
      const selected = employees.find((emp) => emp.id === value);
      setForm((prev) => ({ ...prev, employeeId: value, employeeName: selected?.name || "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !form.employeeId) { setError("Please select an employee."); return; }
    if (!form.date) { setError("Date is required."); return; }
    if (!form.status) { setError("Please select a status."); return; }

    setLoading(true);
    setError("");
    try {
      const url = isEdit ? "/api/attendance/update" : "/api/attendance/create";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? { id: form.id, status: form.status, checkIn: form.checkIn, checkOut: form.checkOut, remarks: form.remarks }
        : { employeeId: form.employeeId, employeeName: form.employeeName, date: form.date, status: form.status, checkIn: form.checkIn, checkOut: form.checkOut, remarks: form.remarks };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save attendance record.");
      toast.success(isEdit ? "Attendance updated successfully!" : "Attendance marked successfully!");
      refreshAttendance();
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to save attendance record.");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slideUp w-full overflow-y-auto"
        style={{ maxWidth: "560px", maxHeight: "95vh", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
      >
        {/* Gradient header */}
        <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "1.25rem 1.25rem 0 0", padding: "1.75rem 2rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              {isEdit ? "Edit Attendance" : "Add Attendance"}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>
              {isEdit ? "Update this attendance record" : "Mark attendance for an employee"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.12)", color: "#c4b5fd" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.75rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Error */}
          {error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
              <span>{error}</span>
            </div>
          )}

          {/* Employee + Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Employee <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <User size={14} style={iconStyle} />
                <select
                  name="employeeId" value={form.employeeId} onChange={handleChange}
                  disabled={isEdit}
                  style={{ ...inputBase, paddingRight: "2.5rem", appearance: "none", cursor: isEdit ? "not-allowed" : "pointer", opacity: isEdit ? 0.7 : 1 }}
                  onFocus={focusIn} onBlur={focusOut}
                >
                  <option value="">{empLoading ? "Loading employees…" : "Select Employee"}</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Date <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrap}>
                <CalendarDays size={14} style={iconStyle} />
                <input
                  type="date" name="date" value={form.date} onChange={handleChange}
                  disabled={isEdit} required
                  style={{ ...inputBase, cursor: isEdit ? "not-allowed" : "text", opacity: isEdit ? 0.7 : 1 }}
                  onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={inputWrap}>
              <ClipboardList size={14} style={iconStyle} />
              <select
                name="status" value={form.status} onChange={handleChange}
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

          {/* Check In / Check Out */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Check In</label>
              <div style={inputWrap}>
                <Clock size={14} style={iconStyle} />
                <input
                  type="time" name="checkIn" value={form.checkIn || ""} onChange={handleChange}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Check Out</label>
              <div style={inputWrap}>
                <Clock size={14} style={iconStyle} />
                <input
                  type="time" name="checkOut" value={form.checkOut || ""} onChange={handleChange}
                  style={inputBase} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label style={labelStyle}>Remarks</label>
            <div style={{ position: "relative" }}>
              <FileText size={14} style={{ ...iconStyle, top: "1.05rem" }} />
              <textarea
                name="remarks" placeholder="Optional notes…"
                value={form.remarks || ""} onChange={handleChange} rows={3}
                style={textareaBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#f0f2f8" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button" onClick={onClose}
              style={{ flex: 1, padding: "0.8125rem 1rem", fontSize: "0.9rem", fontWeight: 600, borderRadius: "0.625rem", border: "1.5px solid #e2e8f0", background: "#f8faff", color: "#475569", cursor: "pointer" }}
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
                ? "Update Attendance"
                : <><Plus size={15} /> Mark Attendance</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
