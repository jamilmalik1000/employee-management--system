"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";

function labelFor(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function valueFor(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    const timestamp = value as { toDate?: () => Date; _seconds?: number };
    if (typeof timestamp.toDate === "function") return timestamp.toDate().toLocaleString();
    if (timestamp._seconds) return new Date(timestamp._seconds * 1000).toLocaleString();
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

export default function RecordDetailsModal({ title, data, onClose }: { title: string; data: object; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="record-details-title" className="record-details-print flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-2xl">
        <header className="record-details-header flex shrink-0 items-center justify-between gap-4 bg-[var(--gradient-brand)] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Record details</p><h2 id="record-details-title" className="truncate text-base font-bold text-white sm:text-lg">{title}</h2></div>
          <button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15 text-white transition hover:bg-white/25" aria-label="Close details"><X size={17} /></button>
        </header>
        <dl className="record-details-grid grid grid-cols-1 overflow-y-auto p-4 sm:grid-cols-2 sm:gap-x-6 sm:p-6">
          {Object.entries(data).map(([key, value]) => <div key={key} className="min-w-0 border-b border-[var(--color-border)] py-3">
            <dt className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{labelFor(key)}</dt>
            <dd className="whitespace-pre-wrap break-words text-sm font-medium text-[var(--color-text-primary)]">{valueFor(value)}</dd>
          </div>)}
        </dl>
        <footer className="record-details-actions flex shrink-0 justify-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] px-4 py-3 sm:px-6">
          <button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2 text-xs font-bold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"><Printer size={15} /> Print details</button>
          <button type="button" onClick={onClose} className="rounded-lg bg-[var(--color-primary)] px-5 py-2 text-xs font-bold text-white transition hover:bg-[var(--color-primary-hover)]">Close</button>
        </footer>
      </section>
    </div>, document.body
  );
}
