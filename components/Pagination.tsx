"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({ page, pageCount, pageSize, total, onPageChange, onPageSizeChange }: Props) {
  if (total < 5 || pageCount <= 1) return null;

  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, total);
  return (
    <nav aria-label="Pagination" className="flex w-full min-w-0 items-center justify-between gap-4 border-t border-slate-200 bg-white px-3 py-2.5 max-sm:flex-col max-sm:items-stretch max-sm:gap-2">
      <span aria-live="polite" className="text-xs font-semibold text-slate-500 max-sm:text-center">Showing {first}–{last} of {total}</span>
      <div className="flex items-center gap-2 max-sm:w-full max-sm:flex-wrap max-sm:justify-center">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">Rows per page
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="h-9 rounded-lg border border-slate-200 bg-slate-100 px-2.5 font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {[5, 10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <button type="button" className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition hover:border-indigo-500 hover:bg-white hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><ChevronLeft size={15} /></button>
        <span aria-current="page" className="min-w-12 text-center text-xs font-bold text-slate-700">{page} / {pageCount}</span>
        <button type="button" className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 transition hover:border-indigo-500 hover:bg-white hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page"><ChevronRight size={15} /></button>
      </div>
    </nav>
  );
}
