"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Plus, Search } from "lucide-react";
import RoleTable from "@/components/roles/RoleTable";
import RoleModal, { Role } from "@/components/roles/RoleModal";
import DeleteRoleModal from "@/components/roles/DeleteRoleModal";
import PermissionGuard from "@/components/PermissionGuard";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";
import PageIntro from "@/components/ui/PageIntro";
import { LoadError } from "@/components/ui/AppState";

export default function RolesPage() {
  const [roles, setRoles]           = useState<Role[]>([]);
  const [loading, setLoading]       = useState(true);
  const [loadError, setLoadError]   = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editRole, setEditRole]     = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [search, setSearch] = useState("");

  const fetchRoles = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res  = await fetch("/api/roles/list");

      if (!res.ok) {
        let message = "Failed to load roles and permissions.";
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
        throw new Error("The role list returned an invalid response.");
      }

      setRoles(data);
    } catch (err) {
      console.error(err);
      setLoadError(err instanceof Error ? err.message : "Failed to load roles and permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleCreate = () => { setEditRole(null); setModalOpen(true); };
  const handleEdit   = (role: Role) => { setEditRole(role); setModalOpen(true); };
  const handleDelete = (role: Role) => setDeleteRole(role);

  function countPerms(r: Role): number {
    const raw = (r as Record<string, unknown>)["permissions"] ?? (r as Record<string, unknown>)["Permissions"];
    if (!raw) return 0;
    if (Array.isArray(raw)) return raw.length;
    if (typeof raw === "object") return Object.values(raw as Record<string, boolean>).filter(Boolean).length;
    return 0;
  }

  const filteredRoles = useMemo(() => {
    const keyword = search.toLowerCase();
    return roles.filter((role) => {
      const name = (role.name || "").toLowerCase();
      const description = ((role as Record<string, unknown>)["description"] || (role as Record<string, unknown>)["Description"] || "").toString().toLowerCase();
      const perms = (() => {
        const raw = (role as Record<string, unknown>)["permissions"] ?? (role as Record<string, unknown>)["Permissions"];
        if (Array.isArray(raw)) return raw.map((k) => String(k).toLowerCase()).join(" ");
        if (raw && typeof raw === "object") return Object.keys(raw as Record<string, boolean>).join(" ").toLowerCase();
        return "";
      })();

      return (
        name.includes(keyword) ||
        description.includes(keyword) ||
        perms.includes(keyword)
      );
    });
  }, [roles, search]);

  const totalPerms = roles.reduce((acc, r) => acc + countPerms(r), 0);

  return (
    <PermissionGuard
      permission="roles"
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <ShieldCheck size={48} color="#e2e8f0" />
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "#64748b" }}>Access Denied</p>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>You don’t have permission to manage roles.</p>
        </div>
      }
    >
      <div className="page-root">

        <PageIntro description="Define roles and control what each role can access" actions={
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus size={16} />
            Create Role
          </button>
        } />

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
              aria-label="Search roles"
              placeholder="Search roles..."
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
            <LoadError message={loadError} onRetry={fetchRoles} />
          </div>
        ) : (
          <RoleTable
            roles={filteredRoles}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyTitle={search ? "No roles match your search" : undefined}
            emptyDescription={search ? "Try a different role name or description." : undefined}
          />
        )}

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
