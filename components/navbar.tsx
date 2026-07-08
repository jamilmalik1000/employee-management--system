"use client";

import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, role } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-20 bg-white shadow-sm border-b-2 border-indigo-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          EMS
        </h1>
        <p className="text-gray-600 font-medium m-0 hidden">Employee Management System</p>
      </div>

      <div className="flex items-center gap-6">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-gray-900 font-semibold text-sm m-0 capitalize">
              {user?.displayName || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-gray-600 text-xs m-0 capitalize">{role || "Employee"}</p>
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.displayName
              ? user.displayName.charAt(0).toUpperCase()
              : user?.email
                ? user.email.charAt(0).toUpperCase()
                : "U"}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg border-none cursor-pointer text-sm transition-colors duration-200 hover:bg-red-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}