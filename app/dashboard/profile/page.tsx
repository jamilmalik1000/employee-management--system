"use client";

import RoleGuard from "@/components/RoleGuard";

export default function ProfilePage() {
  return (
    <RoleGuard allowedRoles={["admin", "hr", "employee"]}>
      <h1>Profile</h1>
    </RoleGuard>
  );
}