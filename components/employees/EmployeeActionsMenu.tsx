"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Pencil, Trash2, Wallet, History } from "lucide-react";
import { Employee } from "@/types/employee";

interface Props {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onAddSalary: (employee: Employee) => void;
  onViewSalaryHistory: (employee: Employee) => void;
}

const MENU_WIDTH = 200;

export default function EmployeeActionsMenu({ employee, onEdit, onDelete, onAddSalary, onViewSalaryHistory }: Props) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef  = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: Math.max(8, rect.right - MENU_WIDTH) });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const items = [
    { label: "Edit",                 icon: Pencil,  color: "#6366f1", onClick: () => onEdit(employee) },
    { label: "Add Salary",           icon: Wallet,  color: "#059669", onClick: () => onAddSalary(employee) },
    { label: "View Salary History",  icon: History, color: "#0891b2", onClick: () => onViewSalaryHistory(employee) },
    { label: "Delete",               icon: Trash2,  color: "#ef4444", onClick: () => onDelete(employee), danger: true },
  ];

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggleOpen}
        title="Actions"
        style={{ width: "2.125rem", height: "2.125rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.5rem", border: "1px solid #e2e8f0", background: open ? "#f1f5f9" : "#fff", color: "#475569", cursor: "pointer" }}
      >
        <MoreVertical size={15} />
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH, background: "#fff", border: "1px solid #e8ecf4", borderRadius: "0.75rem", boxShadow: "0 12px 32px rgba(0,0,0,0.16)", overflow: "hidden", zIndex: 100 }}
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => { setOpen(false); item.onClick(); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.625rem", width: "100%",
                  padding: "0.625rem 0.875rem", fontSize: "0.8125rem", fontWeight: 500,
                  color: item.danger ? "#ef4444" : "#334155", background: "transparent", border: "none",
                  borderTop: item.danger && idx > 0 ? "1px solid #f0f2f8" : "none",
                  cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = item.danger ? "rgba(239,68,68,0.06)" : "#f8faff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Icon size={14} color={item.color} />
                {item.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}
