"use client";

import { useState } from "react";

interface UserFormProps {
  refreshUsers: () => void;
}

export default function UserForm({ refreshUsers }: UserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role,
          department,
          employeeId,
        }),
      });

      if (res.ok) {
        setName("");
        setEmail("");
        setRole("employee");
        setDepartment("");
        setEmployeeId("");
        setIsOpen(false);
        refreshUsers();
      } else {
        setError("Failed to create user. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Add User Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg cursor-pointer text-base transition-all duration-200 flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
      >
        ➕ Add User
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal */}
          <div className="bg-white rounded-xl p-8 max-w-md w-11/12 shadow-2xl animate-slideUp max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 m-0">
                ➕ Add New User
              </h2>
              <p className="text-sm text-gray-600 mt-2 m-0">
                Create a new user account in the system
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 bg-red-100 text-red-900 rounded-md mb-4 text-sm border border-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              {/* Name Field */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2 text-sm">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter user full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2 text-sm">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Role Field */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2 text-sm">
                  Role *
                </label>
                <select
                  title="Select user role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Department Field */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2 text-sm">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="Enter department name"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Employee ID Field */}
              <div className="mb-8">
                <label className="block font-semibold text-gray-700 mb-2 text-sm">
                  Employee ID
                </label>
                <input
                  type="text"
                  placeholder="Enter employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-md border border-gray-300 cursor-pointer text-base transition-all duration-200 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md border-none cursor-pointer text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
                >
                  {loading ? "Creating..." : "✓ Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
