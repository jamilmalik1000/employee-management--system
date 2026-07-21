"use client";

import SettingsForm from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="page-root">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Settings</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>Manage your company profile</p>
      </div>

      <SettingsForm />
    </div>
  );
}
