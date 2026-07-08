"use client";

import { useState } from "react";

interface DeleteUserModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  refreshUsers: () => void;
}

export default function DeleteUserModal({
  userId,
  userName,
  onClose,
  refreshUsers,
}: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/users/delete/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        refreshUsers();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-11/12 shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-red-600 m-0 flex items-center gap-2">
            ⚠️ Delete User
          </h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-gray-900">{userName}</strong>?
          <br />
          <span className="text-red-500 text-sm">This action cannot be undone.</span>
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-md border border-gray-300 cursor-pointer text-base transition-colors duration-200 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md border-none cursor-pointer text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 hover:shadow-lg"
          >
            {loading ? "Deleting..." : "🗑️ Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
