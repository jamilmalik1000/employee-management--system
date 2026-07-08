"use client";

import { User } from "@/app/dashboard/users/page";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-2xl font-semibold">No Users Found</h2>
        <p className="text-gray-500 mt-2">
          Click <b>Add User</b> to create your first user.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr className="text-left text-gray-700">

              <th className="px-6 py-4">Employee ID</th>

              <th className="px-6 py-4">Name</th>

              <th className="px-6 py-4">Email</th>

              <th className="px-6 py-4">Role</th>

              <th className="px-6 py-4">Department</th>

              <th className="px-6 py-4">Status</th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-200 my-5">

            {users.map((user: any) => {

              const employeeId =
                user.employeeId ||
                user.employeeID ||
                user.EmployeeID ||
                "-";

              const department =
                user.department ||
                user.Department ||
                "-";

              const isActive =
                user.isActive ??
                user.IsActive ??
                false;

              const role =
                (user.role || "employee").toLowerCase();

              return (

                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-6 py-4 font-medium">
                    {employeeId}
                  </td>

                  <td className="px-6 py-4">
                    {user.name}
                  </td>

                  <td className="px-6 py-4">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          role === "admin"
                            ? "bg-red-100 text-red-700"
                            : role === "hr"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>

                  </td>

                  <td className="px-6 py-4">
                    {department}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => onEdit(user)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-5 mt-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(user)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-5 mt-4"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}