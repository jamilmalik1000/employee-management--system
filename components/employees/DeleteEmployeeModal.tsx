"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Employee } from "@/types/employee";

interface Props {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  refreshEmployees: () => void;
}

export default function DeleteEmployeeModal({ open, employee, onClose, refreshEmployees }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, employee?.id]);

  if (!employee) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/employees/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: employee.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee.");

      toast.success(`"${employee.name}" deleted successfully.`);
      await refreshEmployees();
      onClose();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to delete employee.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Delete employee?"
      description={<>Delete <strong>{employee.name}</strong> ({employee.employeeId})? Only the employee record will be removed. An employee with a linked login account must be unlinked before deletion. This action cannot be undone.</>}
      confirmLabel="Delete employee"
      busy={loading}
      danger
      error={error}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  );
}
