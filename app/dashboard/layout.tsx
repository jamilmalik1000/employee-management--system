"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import ProtectedRoute from "@/components/protectedroutes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="flex h-screen h-dvh overflow-hidden bg-[var(--color-bg-app)]">

        {/* Sidebar — desktop always visible, mobile via drawer */}
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden" inert={sidebarOpen ? true : undefined} aria-hidden={sidebarOpen ? true : undefined}>
          <Navbar onMenuClick={() => setSidebarOpen(true)} mobileMenuOpen={sidebarOpen} />
          <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl p-4 sm:p-5 lg:px-7 lg:py-6">
              {children}
            </div>
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}
