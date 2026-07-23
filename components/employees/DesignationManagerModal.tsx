"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Designation } from "@/types/designation";

interface Props {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}

const emptyDesignation: Designation = {
  name: "",
  description: "",
  isActive: true,
};

export default function DesignationManagerModal({
  open,
  onClose,
  onChanged,
}: Props) {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [form, setForm] = useState<Designation>(emptyDesignation);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/designations/list");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setDesignations(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load designations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) void load();
  }, [open]);

  if (!open) return null;

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(
        form.id ? "/api/designations/update" : "/api/designations/create",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success(data.message);
      setForm(emptyDesignation);
      await load();
      onChanged();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save designation."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (designation: Designation) => {
    if (
      !designation.id ||
      !window.confirm(`Delete the "${designation.name}" designation?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/designations/delete?id=${encodeURIComponent(designation.id)}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success(data.message);
      if (form.id === designation.id) setForm(emptyDesignation);
      await load();
      onChanged();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete designation."
      );
    }
  };

  return (
    <div
      className="modal-overlay z-[80]"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="designation-manager-title"
        className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 bg-[var(--gradient-brand)] px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15">
              <BriefcaseBusiness size={20} />
            </span>
            <div>
              <h2 id="designation-manager-title" className="text-lg font-bold">
                Manage Designations
              </h2>
              <p className="text-xs text-white/75">
                Add, edit, activate, or delete job titles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg bg-white/15 transition hover:bg-white/25"
            aria-label="Close designation manager"
          >
            <X size={18} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={save}
            className="border-b border-[var(--color-border)] p-5 md:border-b-0 md:border-r sm:p-6"
          >
            <div className="mb-5">
              <h3 className="font-bold text-[var(--color-text-primary)]">
                {form.id ? "Edit designation" : "New designation"}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                The name appears in the employee form.
              </p>
            </div>

            <label className="mb-4 block text-sm font-semibold text-[var(--color-text-secondary)]">
              Name <span className="text-red-500">*</span>
              <input
                className="form-input mt-1.5"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="e.g. Senior Accountant"
                required
              />
            </label>

            <label className="mb-4 block text-sm font-semibold text-[var(--color-text-secondary)]">
              Description
              <textarea
                className="form-input mt-1.5 min-h-24 resize-y"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Optional responsibilities or notes"
              />
            </label>

            <label className="mb-5 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-3 text-sm font-semibold text-[var(--color-text-primary)]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm({ ...form, isActive: event.target.checked })
                }
                className="size-4 accent-indigo-600"
              />
              Active designation
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-primary"
                disabled={saving}
                type="submit"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : form.id ? (
                  <Save size={15} />
                ) : (
                  <Plus size={15} />
                )}
                {form.id ? "Save changes" : "Add designation"}
              </button>
              {form.id && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setForm(emptyDesignation)}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          <div className="min-h-0 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-[var(--color-text-primary)]">
                Designation list
              </h3>
              <span className="badge border-indigo-200 bg-indigo-50 text-indigo-700">
                {designations.length}
              </span>
            </div>

            {loading ? (
              <div className="grid min-h-48 place-items-center text-[var(--color-text-muted)]">
                <Loader2 className="animate-spin" />
              </div>
            ) : designations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center">
                <BriefcaseBusiness
                  className="mx-auto mb-3 text-[var(--color-text-muted)]"
                  size={32}
                />
                <p className="font-semibold text-[var(--color-text-secondary)]">
                  No designations yet
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Add the first designation using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {designations.map((designation) => (
                  <article
                    key={designation.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">
                          {designation.name}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            designation.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {designation.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {designation.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-muted)]">
                          {designation.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg text-indigo-600 transition hover:bg-indigo-100"
                        onClick={() => setForm(designation)}
                        aria-label={`Edit ${designation.name}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg text-red-600 transition hover:bg-red-100"
                        onClick={() => void remove(designation)}
                        aria-label={`Delete ${designation.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
