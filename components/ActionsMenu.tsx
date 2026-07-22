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
    const close = (returnFocus = false) => {
      setOpen(false);
      if (returnFocus) window.requestAnimationFrame(() => buttonRef.current?.focus());
    };
    const closeWithoutFocus = () => close(menuRef.current?.contains(document.activeElement) ?? false);
    const closeOnScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && menuRef.current?.contains(target)) return;
      closeWithoutFocus();
    };
    const outside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target)) close();
    };
    const frame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
    });
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeWithoutFocus);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeWithoutFocus);
      window.removeEventListener("scroll", closeOnScroll, true);
      window.cancelAnimationFrame(frame);
    };
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close(true);
    }
  }, [open]);

  const menuItems: ActionMenuItem[] = details
    ? [{ label: "View details", icon: Eye, onClick: () => setDetailsOpen(true) }, ...items]
    : items;

  return <>
    <button ref={buttonRef} type="button" onClick={toggle} title="Actions" aria-label={details ? `Actions for ${details.title}` : "Open actions"} aria-haspopup="menu" aria-expanded={open} data-open={open ? "true" : "false"} className={`actions-menu-trigger grid size-10 place-items-center rounded-lg border text-slate-600 shadow-sm transition ${open ? "border-indigo-300 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"}`}>
      <MoreVertical size={15} />
    </button>
    {open && typeof document !== "undefined" && createPortal(
      <div
        ref={menuRef}
        role="menu"
        aria-label="Actions"
        onKeyDown={(event) => {
          const controls = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? []);
          if (!controls.length) return;
          const current = Math.max(0, controls.indexOf(document.activeElement as HTMLButtonElement));
          let next = current;
          if (event.key === "ArrowDown") next = (current + 1) % controls.length;
          else if (event.key === "ArrowUp") next = (current - 1 + controls.length) % controls.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = controls.length - 1;
          else if (event.key === "Tab") { setOpen(false); buttonRef.current?.focus(); return; }
          else return;
          event.preventDefault();
          controls[next]?.focus();
        }}
        className="actions-menu-panel fixed z-[100] max-h-[min(320px,70dvh)] w-[200px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_35px_rgba(15,23,42,0.18)]"
        style={position}
      >
        {menuItems.map(({ label, icon: Icon, onClick, danger, disabled }, index) => (
          <Fragment key={`${label}-${index}`}>
            {danger && index > 0 && <div role="separator" className="my-1 border-t border-slate-100" />}
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => { setOpen(false); buttonRef.current?.focus(); onClick(); }}
              className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium leading-5 transition disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "actions-menu-danger text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
            >
              <Icon size={16} className={`shrink-0 ${danger ? "text-red-500" : "text-indigo-500"}`} />
              <span className="truncate">{label}</span>
            </button>
          </Fragment>
        ))}
      </div>, document.body
    )}
    {detailsOpen && details && <RecordDetailsModal title={details.title} data={details.data} onClose={() => { setDetailsOpen(false); buttonRef.current?.focus(); }} />}
  </>;
}
