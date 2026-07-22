"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreVertical, type LucideIcon } from "lucide-react";
import RecordDetailsModal from "@/components/RecordDetailsModal";

export interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export default function ActionsMenu({ items, details }: { items: ActionMenuItem[]; details?: { title: string; data: object } }) {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 6, left: Math.max(8, rect.right - 200) });
    }
    setOpen((value) => !value);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const outside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) close();
    };
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const menuItems: ActionMenuItem[] = details
    ? [{ label: "View details", icon: Eye, onClick: () => setDetailsOpen(true) }, ...items]
    : items;

  return <>
    <button ref={buttonRef} onClick={toggle} title="Actions" aria-label="Open actions" aria-expanded={open} className={`grid size-8 place-items-center rounded-lg border text-slate-600 shadow-sm transition ${open ? "border-indigo-300 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"}`}>
      <MoreVertical size={15} />
    </button>
    {open && typeof document !== "undefined" && createPortal(
      <div ref={menuRef} className="fixed z-[100] w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_35px_rgba(15,23,42,0.18)]" style={position}>
        {menuItems.map(({ label, icon: Icon, onClick, danger, disabled }) => <button
          key={label} disabled={disabled}
          onClick={() => { setOpen(false); onClick(); }}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "mt-1 border-t border-slate-100 text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
        ><span className={`grid size-6 place-items-center rounded-md ${danger ? "bg-red-50 text-red-500" : "bg-indigo-50 text-indigo-500"}`}><Icon size={13} /></span>{label}</button>)}
      </div>, document.body
    )}
    {detailsOpen && details && <RecordDetailsModal title={details.title} data={details.data} onClose={() => setDetailsOpen(false)} />}
  </>;
}
