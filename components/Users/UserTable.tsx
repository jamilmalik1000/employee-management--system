"use client";

import { User } from "@/app/dashboard/users/page";
import UserRow from "./UserRow";

interface UserTableProps {
  users: User[];
  loading: boolean;
  refreshUsers: () => void;
}

export default function UserTable({
  users,
  loading,
  refreshUsers,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base m-0">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-200">
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap">
              Name
            </th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap">
              Email
            </th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap">
              Role
            </th>
            <th className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap">
              Department
            </th>
            <th className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap">
              Employee ID
            </th>
            <th className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-gray-600 border-b border-gray-200">
                <div className="text-5xl mb-2">📭</div>
                <p className="m-0 text-base">
                  No users found. Click the "Add User" button to create one.
                </p>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserRow key={user.id} user={user} refreshUsers={refreshUsers} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
