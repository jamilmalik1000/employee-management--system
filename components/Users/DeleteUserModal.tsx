"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { User } from "@/app/dashboard/users/page";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  refreshUsers: () => void;
}

export default function DeleteUserModal({ open, onClose, user, refreshUsers }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, user?.id]);

  if (!user) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete user.");

      toast.success(`"${user.name}" deleted successfully.`);
      await refreshUsers();
      onClose();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to delete user.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Delete user?"
      description={<>Delete <strong>{user.name}</strong> ({user.email})? This permanently removes both the sign-in account and the user profile. This action cannot be undone.</>}
      confirmLabel="Delete user"
      busy={loading}
      danger
      error={error}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  );
}
