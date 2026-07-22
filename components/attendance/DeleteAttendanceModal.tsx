"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Attendance } from "@/types/attendance";

interface Props {
  open: boolean;
  onClose: () => void;
  attendance: Attendance | null;
  refreshAttendance: () => void;
}

export default function DeleteAttendanceModal({ open, onClose, attendance, refreshAttendance }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setError("");
  }, [open, attendance?.id]);

  if (!attendance) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/attendance/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: attendance.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete attendance record.");

      toast.success(`Attendance for "${attendance.employeeName}" on ${attendance.date} deleted.`);
      await refreshAttendance();
      onClose();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to delete attendance record.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Delete attendance record?"
      description={<>Delete the attendance record for <strong>{attendance.employeeName}</strong> on <strong>{attendance.date}</strong> ({attendance.status}). This action cannot be undone.</>}
      confirmLabel="Delete record"
      busy={loading}
      danger
      error={error}
      onClose={onClose}
      onConfirm={handleDelete}
    />
  );
}
