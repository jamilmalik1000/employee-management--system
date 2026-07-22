"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Role } from "./RoleModal";

interface Props {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  refreshRoles: () => void;
}

export default function DeleteRoleModal({ open, onClose, role, refreshRoles }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, role?.id]);

  if (!role) return null;

  const isAdmin = role.name?.toLowerCase() === "admin";

  const handleDelete = async () => {
    if (isAdmin) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/roles/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: role.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete role.");

      toast.success(`"${role.name}" role deleted successfully.`);
      await refreshRoles();
      onClose();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to delete role.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Delete role?"
      description={<>Delete <strong>{role.name}</strong>? Only this role definition will be removed. Roles assigned to one or more users cannot be deleted, and the Admin role is protected. This action cannot be undone.</>}
      confirmLabel="Delete role"
      busy={loading}
      danger
      error={isAdmin ? "The Admin role is protected and cannot be deleted." : error}
      confirmDisabled={isAdmin}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  );
}
