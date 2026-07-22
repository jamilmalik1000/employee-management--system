"use client";

import { useId, type ReactNode } from "react";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useDialog } from "@/hooks/useDialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  danger?: boolean;
  error?: string;
  confirmDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy = false,
  danger = false,
  error,
  confirmDisabled = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const dialogRef = useDialog<HTMLDivElement>(open, () => { if (!busy) onClose(); });
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="modal-overlay z-[130]" onClick={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <div
        ref={dialogRef}
        role={danger ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={`${descriptionId}${error ? ` ${errorId}` : ""}`}
        aria-busy={busy || undefined}
        tabIndex={-1}
        className="confirm-dialog card animate-slideUp"
      >
        <div className={`confirm-dialog-icon ${danger ? "danger" : ""}`}><AlertTriangle size={22} /></div>
        <div className="confirm-dialog-copy">
          <h2 id={titleId}>{title}</h2>
          <div id={descriptionId} className="confirm-dialog-description">{description}</div>
          {error && <p id={errorId} role="alert" className="confirm-dialog-error">{error}</p>}
        </div>
        <button type="button" aria-label="Close confirmation" onClick={onClose} disabled={busy} className="btn btn-icon btn-secondary confirm-dialog-close"><X size={16} /></button>
        <div className="confirm-dialog-actions">
          <button type="button" data-autofocus className="btn btn-secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="button" className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm} disabled={busy || confirmDisabled}>{busy && <LoaderCircle size={15} className="animate-spin" />}{confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
