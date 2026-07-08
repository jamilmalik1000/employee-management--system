"use client";

import RoleGuard from "@/components/RoleGuard";

export default function EmployeesPage() {
  return (
    <RoleGuard allowedRoles={["admin", "hr"]}>
      <h1>Employees</h1>
    </RoleGuard>
  );
}