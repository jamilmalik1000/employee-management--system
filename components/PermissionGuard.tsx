"use client";

import { ReactNode } from "react";
import { useAuth } from "@/Context/AuthContext";

interface Props {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGuard({ permission, children, fallback = null }: Props) {
  const { permissions, role, loading } = useAuth();
  if (loading) return null;
  if (role?.toLowerCase() === "admin") return <>{children}</>;
  if (!permissions.includes(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
