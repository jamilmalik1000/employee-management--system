import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { AuthProvider } from "@/Context/AuthContext";
import { ThemeProvider } from "@/Context/ThemeContext";
import AppToaster from "@/components/AppToaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EMS — Employee Management System",
  description: "Role-based Employee Management System",
};

/* Sets data-theme on <html> before hydration so a saved "dark" preference
   doesn't flash light first. */
const themeInitScript = `(function(){try{var t=localStorage.getItem('ems-theme')||'default';var d=t==='dark'||(t==='default'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
