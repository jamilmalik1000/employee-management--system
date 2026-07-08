"use client";

import RoleGuard from "@/components/RoleGuard";

export default function AttendancePage() {
  return (
    <RoleGuard allowedRoles={["admin", "hr", "employee"]}>
      <h1>Attendance</h1>
    </RoleGuard>
  );
}