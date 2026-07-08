"use client";

import RoleGuard from "@/components/RoleGuard";

export default function LeavesPage() {
  return (
    <RoleGuard allowedRoles={["admin", "hr", "employee"]}>
      <h1>Leave Requests</h1>
    </RoleGuard>
  );
}