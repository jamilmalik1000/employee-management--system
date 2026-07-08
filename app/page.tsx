"use client";

import { useAuth } from "@/Context/AuthContext";

export default function DashboardPage() {
  const { user, role } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-4">
        <strong>User:</strong> {user?.email}
      </p>

      <p className="mt-2">
        <strong>Role:</strong> {role}
      </p>
    </div>
  );
}