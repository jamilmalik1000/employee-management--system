"use client";

import { Fragment, useEffect, useRef, useState } from "react";
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
      const itemCount = items.length + (details ? 1 : 0);
      const estimatedHeight = itemCount * 40 + 16;
      const top = rect.bottom + 6 + estimatedHeight > window.innerHeight
        ? Math.max(8, rect.top - estimatedHeight - 6)
        : rect.bottom + 6;
      setPosition({ top, left: Math.min(window.innerWidth - 208, Math.max(8, rect.right - 200)) });
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
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
  }, [open]);

  const menuItems: ActionMenuItem[] = details
    ? [{ label: "View details", icon: Eye, onClick: () => setDetailsOpen(true) }, ...items]
    : items;

  return <>
    <button ref={buttonRef} onClick={toggle} title="Actions" aria-label="Open actions" aria-expanded={open} className={`grid size-8 place-items-center rounded-lg border text-slate-600 shadow-sm transition ${open ? "border-indigo-300 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"}`}>
      <MoreVertical size={15} />
    </button>
    {open && typeof document !== "undefined" && createPortal(
      <div ref={menuRef} role="menu" aria-label="Actions" className="fixed z-[100] max-h-[min(320px,70dvh)] w-[200px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_35px_rgba(15,23,42,0.18)]" style={position}>
        {menuItems.map(({ label, icon: Icon, onClick, danger, disabled }, index) => (
          <Fragment key={`${label}-${index}`}>
            {danger && index > 0 && <div className="my-1 border-t border-slate-100" />}
            <button
              type="button"
              role="menuitem"
              disabled={disabled}
              onClick={() => { setOpen(false); onClick(); }}
              className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium leading-5 transition disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
            >
              <Icon size={16} className={`shrink-0 ${danger ? "text-red-500" : "text-indigo-500"}`} />
              <span className="truncate">{label}</span>
            </button>
          </Fragment>
        ))}
      </div>, document.body
    )}
    {detailsOpen && details && <RecordDetailsModal title={details.title} data={details.data} onClose={() => setDetailsOpen(false)} />}
  </>;
}
