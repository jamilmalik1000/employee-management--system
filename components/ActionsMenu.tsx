"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, type LucideIcon } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export default function ActionsMenu({ items }: { items: ActionMenuItem[] }) {
  const [open, setOpen] = useState(false);
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

  return <>
    <button ref={buttonRef} onClick={toggle} title="Actions" aria-label="Open actions" className="grid size-[2.125rem] place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
      <MoreVertical size={15} />
    </button>
    {open && typeof document !== "undefined" && createPortal(
      <div ref={menuRef} className="fixed z-[100] w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl" style={position}>
        {items.map(({ label, icon: Icon, onClick, danger, disabled }) => <button
          key={label} disabled={disabled}
          onClick={() => { setOpen(false); onClick(); }}
          className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "border-t border-slate-100 text-red-500 hover:bg-red-50" : "text-slate-700 hover:bg-indigo-50"}`}
        ><Icon size={14} className={danger ? "text-red-500" : "text-indigo-500"} />{label}</button>)}
      </div>, document.body
    )}
  </>;
}
