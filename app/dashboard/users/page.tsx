"use client";

import { useEffect, useState } from "react";
import UserTable from "@/components/Users/UserTable";
import UserModal from "@/components/Users/UserModal";
import DeleteUserModal from "@/components/Users/DeleteUserModal";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  isActive: boolean;
}

const emptyUser: User = {
  id: "",
  name: "",
  email: "",
  role: "employee",
  department: "",
  employeeId: "",
  isActive: true,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User>(emptyUser);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  async function fetchUsers() {
    setLoading(true);

    const res = await fetch("/api/users/list");
    const data = await res.json();

    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleAdd() {
    setEditingUser(emptyUser);
    setOpenModal(true);
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setOpenModal(true);
  }

  function handleDelete(user: User) {
    setSelectedUser(user);
    setDeleteModal(true);
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="text-gray-500">
            Manage Admin, HR and Employees
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          + Add User
        </button>

      </div>

      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={editingUser}
        refreshUsers={fetchUsers}
      />

      <DeleteUserModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        user={selectedUser}
        refreshUsers={fetchUsers}
      />

    </div>
  );
}