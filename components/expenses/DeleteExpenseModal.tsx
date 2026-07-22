"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Expense } from "@/types/expense";

interface Props {
  open: boolean;
  onClose: () => void;
  expense: Expense | null;
  refreshExpenses: () => void;
}

export default function DeleteExpenseModal({ open, onClose, expense, refreshExpenses }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, expense?.id]);

  if (!expense) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/expenses/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: expense.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete expense.");

      toast.success(`"${expense.title}" deleted successfully.`);
      await refreshExpenses();
      onClose();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to delete expense.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Delete expense?"
      description={<>Delete <strong>{expense.title}</strong> from {expense.date} ({expense.category}). This permanently removes only this expense record and cannot be undone.</>}
      confirmLabel="Delete expense"
      busy={loading}
      danger
      error={error}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  );
}
