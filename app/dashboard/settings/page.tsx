"use client";

import SettingsForm from "@/components/settings/SettingsForm";
import PageIntro from "@/components/ui/PageIntro";
import PermissionGuard from "@/components/PermissionGuard";

export default function SettingsPage() {
  return (
    <PermissionGuard permission="settings"><div className="page-root">

      <PageIntro description="Manage your company profile" />

      <SettingsForm />
    </div></PermissionGuard>
  );
}
