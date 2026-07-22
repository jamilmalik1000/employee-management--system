"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import UserTable from "@/components/Users/UserTable";
import UserModal from "@/components/Users/UserModal";
import DeleteUserModal from "@/components/Users/DeleteUserModal";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";
import PageIntro from "@/components/ui/PageIntro";
import { LoadError } from "@/components/ui/AppState";
import PermissionGuard from "@/components/PermissionGuard";

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
  return <PermissionGuard permission="users"><UsersContent /></PermissionGuard>;
}

function UsersContent() {
  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState("");
  const [openModal, setOpenModal]   = useState(false);
  const [editingUser, setEditingUser] = useState<User>(emptyUser);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/users/list");

      if (!res.ok) {
        let message = "Failed to load users.";
        try {
          const errorData = (await res.json()) as { message?: string };
          message = errorData.message || message;
        } catch {
          // Keep the module-specific fallback when the error body is not JSON.
        }
        throw new Error(message);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("The user list returned an invalid response.");
      }

      setUsers(data);
    } catch (err) {
      console.error(err);
      setLoadError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd    = () => { setEditingUser(emptyUser); setOpenModal(true); };
  const handleEdit   = (user: User) => { setEditingUser(user); setOpenModal(true); };
  const handleDelete = (user: User) => { setSelectedUser(user); setDeleteModal(true); };

  const activeCount   = users.filter((u) => u.isActive).length;
  const deptCount     = new Set(users.map((u) => u.department).filter(Boolean)).size;

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword) ||
        user.department.toLowerCase().includes(keyword) ||
        user.employeeId.toLowerCase().includes(keyword);
      return matchesSearch;
    });
  }, [users, search]);

  return (
    <div className="page-root">

      <PageIntro description="Manage admins, HR staff and employees" actions={
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={16} />
          Add User
        </button>
      } />

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
              <p style={{ fontSize: "1.625rem", fontWeight: 800, color: s.color, lineHeight: 1, margin: 0 }}>{loading || loadError ? "—" : s.value}</p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          padding: "1.25rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.875rem",
          alignItems: "center",
        }}
      >
        <div style={inputWrap}>
          <Search size={14} style={iconStyle} />
          <input
            type="text"
            aria-label="Search users"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputBase}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>
      </div>

      {/* Table */}
      {loadError ? (
        <div className="card">
          <LoadError message={loadError} onRetry={fetchUsers} />
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyTitle={search ? "No users match your search" : undefined}
          emptyDescription={search ? "Try a different name, email, role, or department." : undefined}
        />
      )}

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
