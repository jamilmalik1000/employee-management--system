"use client";

import { ReactNode } from "react";
import { useAuth } from "@/Context/AuthContext";
import { AccessDenied, AppLoader } from "@/components/ui/AppState";

interface Props {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGuard({ permission, children, fallback = null }: Props) {
  const { permissions, role, loading } = useAuth();
  if (loading) return <AppLoader label="Checking access…" />;
  if (role?.toLowerCase() === "admin") return <>{children}</>;
  if (!permissions.includes(permission)) return <>{fallback ?? <AccessDenied />}</>;
  return <>{children}</>;
}
