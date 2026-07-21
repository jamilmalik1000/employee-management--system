import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { AuthProvider } from "@/Context/AuthContext";
import { ThemeProvider } from "@/Context/ThemeContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EMS — Employee Management System",
  description: "Role-based Employee Management System",
};

/* Sets data-theme on <html> before hydration so a saved "dark" preference
   doesn't flash light first. */
const themeInitScript = `(function(){try{var t=localStorage.getItem('ems-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
