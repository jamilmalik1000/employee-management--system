"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { todayLocalISO } from "@/lib/date";
import type { Employee } from "@/types/employee";

interface Props {
  employee: Employee | null;
  onClose: () => void;
  onSaved?: () => void;
}

export default function EmployeeLeaveRequestModal({
  employee,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    leaveType: "Annual",
    startDate: todayLocalISO(),
    endDate: todayLocalISO(),
    reason: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!employee) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [employee, onClose]);

  if (!employee?.id) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/leaves/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          employeeId: employee.id,
          employeeName: employee.name,
          userId: employee.userId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success(data.message);
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create the leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay z-[90]"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-leave-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 bg-[var(--gradient-brand)] px-5 py-5 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15">
              <CalendarPlus size={20} />
            </span>
            <div>
              <h2 id="employee-leave-title" className="text-lg font-bold">
                Create Leave Request
              </h2>
              <p className="text-xs text-white/75">{employee.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg bg-white/15 transition hover:bg-white/25"
            aria-label="Close leave request"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={submit} className="grid gap-4 p-5 sm:p-6">
          <label className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Leave type
            <select
              className="form-input mt-1.5"
              value={form.leaveType}
              onChange={(event) =>
                setForm({ ...form, leaveType: event.target.value })
              }
            >
              <option>Annual</option>
              <option>Sick</option>
              <option>Casual</option>
              <option>Unpaid</option>
              <option>Other</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Start date
              <input
                className="form-input mt-1.5"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm({
                    ...form,
                    startDate: event.target.value,
                    endDate:
                      event.target.value > form.endDate
                        ? event.target.value
                        : form.endDate,
                  })
                }
                required
              />
            </label>
            <label className="text-sm font-semibold text-[var(--color-text-secondary)]">
              End date
              <input
                className="form-input mt-1.5"
                type="date"
                min={form.startDate}
                value={form.endDate}
                onChange={(event) =>
                  setForm({ ...form, endDate: event.target.value })
                }
                required
              />
            </label>
          </div>

          <label className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Reason
            <textarea
              className="form-input mt-1.5 min-h-28 resize-y"
              value={form.reason}
              onChange={(event) =>
                setForm({ ...form, reason: event.target.value })
              }
              placeholder="Reason for the leave request"
              required
            />
          </label>

          <footer className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CalendarPlus size={16} />
              )}
              Create request
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
