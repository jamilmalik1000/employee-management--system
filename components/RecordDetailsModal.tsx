"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";

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
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <section className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex shrink-0 items-center justify-between bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-3.5 sm:px-6 sm:py-4">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Record details</p><h2 className="text-base font-bold text-white sm:text-lg">{title}</h2></div>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-lg bg-white/15 text-white transition hover:bg-white/25" aria-label="Close details"><X size={17} /></button>
        </header>
        <div className="grid overflow-y-auto p-4 sm:grid-cols-2 sm:gap-x-6 sm:p-6">
          {Object.entries(data).map(([key, value]) => <div key={key} className="border-b border-slate-100 py-3 sm:min-w-0">
            <dt className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{labelFor(key)}</dt>
            <dd className="whitespace-pre-wrap break-words text-sm font-medium text-slate-700">{valueFor(value)}</dd>
          </div>)}
        </div>
        <footer className="flex shrink-0 justify-end border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
          <button onClick={onClose} className="rounded-lg bg-slate-800 px-5 py-2 text-xs font-bold text-white transition hover:bg-slate-700">Close</button>
        </footer>
      </section>
    </div>, document.body
  );
}
