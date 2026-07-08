"use client";

import { User } from "@/app/dashboard/users/page";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  refreshUsers: () => void;
}

export default function DeleteUserModal({
  open,
  onClose,
  user,
  refreshUsers,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !user) return null;
  const currentUser = user;

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: currentUser.id ,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      await refreshUsers();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <div className="text-center">

          <div className="text-6xl mb-4">⚠️</div>

          <h2 className="text-2xl font-bold text-red-600">
            Delete User
          </h2>

          <p className="mt-4 text-gray-600">
            Are you sure you want to delete
          </p>

          <p className="font-bold text-lg mt-2">
            {currentUser.name}
          </p>

          <p className="text-gray-500">
            {currentUser.email}
          </p>

          <p className="mt-4 text-sm text-red-500">
            This action cannot be undone.
          </p>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}