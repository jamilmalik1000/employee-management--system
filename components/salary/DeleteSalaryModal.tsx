"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { SalaryRecord } from "@/types/salary";

interface Props {
  open: boolean;
  onClose: () => void;
  salary: SalaryRecord | null;
  refreshSalary: () => void;
}

export default function DeleteSalaryModal({ open, onClose, salary, refreshSalary }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, salary?.id]);

  if (!salary) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/salary/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: salary.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete salary record.");

      toast.success(`Salary record for ${salary.month} deleted.`);
      await refreshSalary();
      onClose();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to delete salary record.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Delete salary record?"
      description={<>Delete the <strong>{salary.month}</strong> salary record for <strong>{salary.employeeName}</strong> ({salary.status}). This action cannot be undone.</>}
      confirmLabel="Delete record"
      busy={loading}
      danger
      error={error}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  );
}
