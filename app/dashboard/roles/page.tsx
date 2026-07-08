"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Plus } from "lucide-react";
import RoleTable from "@/components/roles/RoleTable";
import RoleModal, { Role } from "@/components/roles/RoleModal";
import DeleteRoleModal from "@/components/roles/DeleteRoleModal";
import PermissionGuard from "@/components/PermissionGuard";

export default function RolesPage() {
  const [roles, setRoles]           = useState<Role[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editRole, setEditRole]     = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/role/list");
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleCreate = () => { setEditRole(null); setModalOpen(true); };
  const handleEdit   = (role: Role) => { setEditRole(role); setModalOpen(true); };
  const handleDelete = (role: Role) => setDeleteRole(role);

  const totalPerms = roles.reduce((acc, r) => acc + (r.permissions?.length ?? 0), 0);

  return (
    <PermissionGuard
      permission="roles"
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <ShieldCheck size={48} color="#e2e8f0" />
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "#64748b" }}>Access Denied</p>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>You don't have permission to manage roles.</p>
        </div>
      }
    >
      <div className="page-root">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Roles & Permissions</h1>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
              Define roles and control what each role can access
            </p>
          </div>
          <button
            onClick={handleCreate}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
          >
            <Plus size={16} />
            Create Role
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Total Roles",       value: roles.length,  icon: "🛡️", color: "#6366f1", bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.15)" },
            { label: "Total Permissions", value: totalPerms,    icon: "🔑", color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.15)"  },
            { label: "Custom Roles",      value: roles.filter(r => !["admin","hr","employee"].includes(r.name)).length, icon: "✨", color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.15)" },
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
        <RoleTable roles={roles} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      </div>

      {/* Modals */}
      <RoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        role={editRole}
        refreshRoles={fetchRoles}
      />
      <DeleteRoleModal
        open={!!deleteRole}
        onClose={() => setDeleteRole(null)}
        role={deleteRole}
        refreshRoles={fetchRoles}
      />
    </PermissionGuard>
  );
}
