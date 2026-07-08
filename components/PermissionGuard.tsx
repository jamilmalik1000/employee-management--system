"use client";

import { ReactNode } from "react";
import { useAuth } from "@/Context/AuthContext";
import { ROLE_PERMISSIONS } from "@/lib/permission";

interface Props {
  permission: string;
  children: ReactNode;
}

export default function PermissionGuard({
  permission,
  children,
}: Props) {
  const { role } = useAuth();

  if (!role) return null;

  const permissions =
    ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];

  if (!permissions.includes(permission)) {
    return null;
  }

  return <>{children}</>;
}