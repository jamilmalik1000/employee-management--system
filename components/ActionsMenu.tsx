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
    <button ref={buttonRef} onClick={toggle} title="Actions" aria-label="Open actions" aria-expanded={open} className={`grid size-8 place-items-center rounded-lg border text-[var(--color-text-secondary)] shadow-sm transition ${open ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"}`}>
      <MoreVertical size={15} />
    </button>
    {open && typeof document !== "undefined" && createPortal(
      <div ref={menuRef} role="menu" aria-label="Actions" className="fixed z-[100] max-h-[min(320px,70dvh)] w-[220px] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-2 shadow-xl ring-1 ring-black/5 animate-slideDown" style={position}>
        {menuItems.map(({ label, icon: Icon, onClick, danger, disabled }, index) => (
          <Fragment key={`${label}-${index}`}>
            {danger && index > 0 && <div className="my-1.5 mx-1 border-t border-[var(--color-border-strong)] opacity-50" />}
            <button
              type="button"
              role="menuitem"
              disabled={disabled}
              onClick={() => { setOpen(false); onClick(); }}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold leading-5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"}`}
            >
              <div className={`flex size-7 shrink-0 items-center justify-center rounded-md transition-colors ${danger ? "bg-red-50 text-red-500 group-hover:bg-red-100 group-hover:text-red-600 dark:bg-red-500/10 dark:group-hover:bg-red-500/20" : "bg-[var(--color-bg-surface-alt)] text-[var(--color-text-muted)] group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)]"}`}>
                <Icon size={15} />
              </div>
              <span className="truncate">{label}</span>
            </button>
          </Fragment>
        ))}
      </div>, document.body
    )}
    {detailsOpen && details && <RecordDetailsModal title={details.title} data={details.data} onClose={() => setDetailsOpen(false)} />}
  </>;
}
