"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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

const emptyUser: User = { id: "", name: "", email: "", role: "employee", department: "", employeeId: "", isActive: true };

export default function UsersPage() {
  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [openModal, setOpenModal]   = useState(false);
  const [editingUser, setEditingUser] = useState<User>(emptyUser);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/list");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd    = () => { setEditingUser(emptyUser); setOpenModal(true); };
  const handleEdit   = (user: User) => { setEditingUser(user); setOpenModal(true); };
  const handleDelete = (user: User) => { setSelectedUser(user); setDeleteModal(true); };

  const activeCount   = users.filter((u) => u.isActive).length;
  const deptCount     = new Set(users.map((u) => u.department).filter(Boolean)).size;

  return (
    <div className="page-root" style={{ paddingLeft: "1.5rem",paddingRight: "1.5rem", paddingTop: "2rem", paddingBottom: "2rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>User Management</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>Manage admins, HR staff and employees</p>
        </div>
        <button
          onClick={handleAdd}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Users",   value: users.length,  icon: "👥", color: "#6366f1", bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.15)" },
          { label: "Active Users",  value: activeCount,   icon: "✅", color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.15)"  },
          { label: "Departments",   value: deptCount,     icon: "🏢", color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.15)"  },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: "1.625rem", fontWeight: 800, color: s.color, lineHeight: 1, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <UserTable users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modals */}
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
