"use client";

import { useEffect, useRef } from "react";

const dialogStack: symbol[] = [];

const focusableSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const dialogRef = useRef<T>(null);
  const dialogId = useRef(Symbol("dialog"));
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const currentId = dialogId.current;
    dialogStack.push(currentId);
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousRegion = previousFocus?.closest<HTMLElement>(".table-scroll-region") ?? null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const target = dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")
        ?? dialogRef.current?.querySelector<HTMLElement>(focusableSelector)
        ?? dialogRef.current;
      target?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (dialogStack.at(-1) !== currentId) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length > 0);
      if (controls.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      const stackIndex = dialogStack.lastIndexOf(currentId);
      if (stackIndex >= 0) dialogStack.splice(stackIndex, 1);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => {
        const fallback = previousRegion?.isConnected
          ? previousRegion
          : document.getElementById("main-content");
        (previousFocus?.isConnected ? previousFocus : fallback)?.focus();
      });
    };
  }, [open]);

  return dialogRef;
}
