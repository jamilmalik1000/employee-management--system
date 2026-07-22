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
  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, total);
  return (
    <div className="pagination-bar">
      <span className="pagination-summary">Showing {first}–{last} of {total}</span>
      <div className="pagination-actions">
        <label className="page-size-label">Rows per page
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="page-size-select">
            {[5, 10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <button className="page-button" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><ChevronLeft size={15} /></button>
        <span className="page-indicator">{page} / {pageCount}</span>
        <button className="page-button" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page"><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}
