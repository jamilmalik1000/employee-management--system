"use client";

import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccessDenied, AppLoader } from "@/components/ui/AppState";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role && !allowedRoles.includes(role)) {
      router.replace("/dashboard");
    }
  }, [role, loading, allowedRoles, router]);

  if (loading) {
    return <AppLoader label="Checking access…" />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
