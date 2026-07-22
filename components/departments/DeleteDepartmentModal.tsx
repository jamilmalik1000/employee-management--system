"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Department } from "@/types/department";

interface Props {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  refreshDepartments: () => void;
}

export default function DeleteDepartmentModal({ open, onClose, department, refreshDepartments }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, department?.id]);

  if (!department) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/departments/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: department.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete department.");

      toast.success(`"${department.name}" deleted successfully.`);
      await refreshDepartments();
      onClose();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to delete department.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Delete department?"
      description={<>Delete <strong>{department.name}</strong>? Only the department record will be removed. A department assigned to one or more employees cannot be deleted. This action cannot be undone.</>}
      confirmLabel="Delete department"
      busy={loading}
      danger
      error={error}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  );
}
