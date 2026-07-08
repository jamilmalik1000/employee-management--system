"use client";

import { useEffect, useState } from "react";
import UserTable from "@/components/Users/UserTable";
import UserForm from "@/components/Users/UserForm";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  isActive: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Normalize API response to match User interface
  const normalizeUser = (data: any): User => ({
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role?.toLowerCase() || "employee",
    department: data.department || data.Department || "",
    employeeId: data.employeeId || data.employeeID || data.EmployeeID || "",
    isActive: data.isActive !== undefined ? data.isActive : data.IsActive !== undefined ? data.IsActive : true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/list");
      const data = await res.json();

      // Normalize the data
      const normalizedUsers = (Array.isArray(data) ? data : data.users || []).map(normalizeUser);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b-2 border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            👥 Users Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 m-0">
            Manage all system users and their roles
          </p>
        </div>

        <UserForm refreshUsers={fetchUsers} />
      </div>

      {/* Table Section */}
      <UserTable
        users={users}
        loading={loading}
        refreshUsers={fetchUsers}
      />
    </div>
  );
}