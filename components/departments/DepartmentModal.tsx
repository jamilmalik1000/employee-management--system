"use client";

import { useEffect, useState } from "react";
import {
  X, Plus, Building2, FileText, ToggleLeft,
  AlertCircle, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Department as DepartmentType } from "@/app/dashboard/departments/page";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut, labelStyle } from "@/lib/ui";
import { textareaBase } from "@/lib/ui";

interface Props {
  open: boolean;
  onClose: () => void;
  department: DepartmentType;
  refreshDepartments: () => void;
}

export default function DepartmentModal({ open, onClose, department, refreshDepartments }: Props) {
  const isEdit = !!department.id;

  const [form, setForm] = useState<DepartmentType>(department);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* reset form whenever the modal opens (handles close → reopen with stale data) */
  useEffect(() => {
    if (!open) return;
    setForm(department);
    setError("");
  }, [open, department]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.name.trim() === "") {
      setError("Department name is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const url = isEdit ? "/api/departments/update" : "/api/departments/create";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? { id: form.id, name: form.name, description: form.description, isActive: form.isActive }
        : { name: form.name, description: form.description, isActive: form.isActive ?? true };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save department.");
      toast.success(isEdit ? "Department updated successfully!" : "Department created successfully!");
      refreshDepartments();
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to save department.");
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
              {isEdit ? "Edit Department" : "Add New Department"}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "#c4b5fd", marginTop: "0.375rem" }}>
              {isEdit ? "Update the department's details" : "Fill in the details to create a new department"}
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

          {/* Name */}
          <div>
            <label style={labelStyle}>Department Name <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={inputWrap}>
              <Building2 size={14} style={iconStyle} />
              <input
                type="text" name="name" placeholder="e.g. Engineering"
                value={form.name} onChange={handleChange} required
                style={inputBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <div style={{ position: "relative" }}>
              <FileText size={14} style={{ ...iconStyle, top: "1.05rem" }} />
              <textarea
                name="description" placeholder="Short description of the department…"
                value={form.description} onChange={handleChange} rows={3}
                style={textareaBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>

          {/* Active toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: "#f8faff", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", cursor: "pointer" }}>
            <input
              type="checkbox" name="isActive"
              checked={form.isActive ?? true} onChange={handleChange}
              style={{ width: "1rem", height: "1rem", accentColor: "#6366f1", cursor: "pointer" }}
            />
            <ToggleLeft size={16} color="#6366f1" />
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>Active Department</p>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>Inactive departments are hidden from employee assignments</p>
            </div>
          </label>

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
                ? "Update Department"
                : <><Plus size={15} /> Create Department</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
