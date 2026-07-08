"use client";

import { User } from "@/app/dashboard/users/page";
import DeleteUserModal from "./DeleteUserModal";
import { useState } from "react";

interface UserRowProps {
  user: User;
  refreshUsers: () => void;
}

export default function UserRow({ user, refreshUsers }: UserRowProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-yellow-100 text-yellow-800";
      case "hr":
        return "bg-purple-100 text-purple-800";
      case "employee":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <tr
        className={`border-b border-gray-200 transition-colors duration-200 ${
          isHovered ? "bg-gray-50" : "bg-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Name with Avatar */}
        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-900 font-medium text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs sm:text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{user.name}</span>
          </div>
        </td>

        {/* Email */}
        <td className="px-3 sm:px-4 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm truncate">
          {user.email}
        </td>

        {/* Role Badge */}
        <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm">
          <span
            className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getRoleColor(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </td>

        {/* Department - Hidden on mobile */}
        <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm truncate">
          {user.department || "N/A"}
        </td>

        {/* Employee ID - Hidden on tablet and below */}
        <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm">
          {user.employeeId || "N/A"}
        </td>

        {/* Status - Hidden on mobile */}
        <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4">
          <span
            className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
              user.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.isActive ? "✓ Active" : "✗ Inactive"}
          </span>
        </td>

        {/* Actions */}
        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
          <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
            <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 text-blue-700 border-none rounded-md font-semibold text-xs cursor-pointer transition-colors duration-200 hover:bg-blue-200">
              ✏️
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-100 text-red-700 border-none rounded-md font-semibold text-xs cursor-pointer transition-colors duration-200 hover:bg-red-200"
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>

      {showDeleteModal && (
        <DeleteUserModal
          userId={user.id}
          userName={user.name}
          onClose={() => setShowDeleteModal(false)}
          refreshUsers={refreshUsers}
        />
      )}
    </>
  );
}
