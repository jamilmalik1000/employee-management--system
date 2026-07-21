"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import ProtectedRoute from "@/components/protectedroutes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--color-bg-app)" }}>

        {/* Sidebar — desktop always visible, mobile via drawer */}
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

        {/* Main column */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem 1rem" }} className="sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}
