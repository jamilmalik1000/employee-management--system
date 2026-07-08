"use client";

import RoleGuard from "@/components/RoleGuard";

export default function DepartmentsPage() {
  return (
    <RoleGuard allowedRoles={["admin", "hr"]}>
      <h1>Departments</h1>
    </RoleGuard>
  );
}