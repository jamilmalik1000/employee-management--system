"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/Context/ThemeContext";

export default function AppToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster position="top-right" theme={resolvedTheme} richColors closeButton />;
}
