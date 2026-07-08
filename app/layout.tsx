import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/Context/AuthContext";

export const metadata: Metadata = {
  title: "ERP System",
  description: "Role Based ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}