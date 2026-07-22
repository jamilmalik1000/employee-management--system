"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import DepartmentTable from "@/components/departments/DepartmentTable";
import DepartmentModal from "@/components/departments/DepartmentModal";
import DeleteDepartmentModal from "@/components/departments/DeleteDepartmentModal";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";
import { Department } from "@/types/department";
import PageIntro from "@/components/ui/PageIntro";
import { LoadError } from "@/components/ui/AppState";
import PermissionGuard from "@/components/PermissionGuard";

const emptyDepartment: Department = { id: "", name: "", description: "", isActive: true };

export default function DepartmentsPage() {
  return <PermissionGuard permission="departments"><DepartmentsContent /></PermissionGuard>;
}

function DepartmentsContent() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department>(emptyDepartment);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [search, setSearch] = useState("");

  const fetchDepartments = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/departments/list");

      if (!res.ok) {
        let message = "Failed to load departments.";
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
        throw new Error("The department list returned an invalid response.");
      }

      setDepartments(data);
    } catch (err) {
      console.error(err);
      setLoadError(err instanceof Error ? err.message : "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleAdd = () => { setEditingDepartment(emptyDepartment); setOpenModal(true); };
  const handleEdit = (department: Department) => { setEditingDepartment(department); setOpenModal(true); };
  const handleDelete = (department: Department) => { setSelectedDepartment(department); setDeleteModal(true); };

  const activeCount = departments.filter((d) => d.isActive).length;
  const inactiveCount = departments.length - activeCount;

  const filteredDepartments = useMemo(() => {
    const keyword = search.toLowerCase();
    return departments.filter((department) => {
      const matchesSearch =
        department.name.toLowerCase().includes(keyword) ||
        department.description.toLowerCase().includes(keyword);
      return matchesSearch;
    });
  }, [departments, search]);

  return (
    <div className="page-root">

      <PageIntro description="Organize your company into departments" actions={
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={16} />
          Add Department
        </button>
      } />

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Departments", value: departments.length, icon: "🏢", color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.15)" },
          { label: "Active Departments", value: activeCount, icon: "✅", color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.15)" },
          { label: "Inactive Departments", value: inactiveCount, icon: "⏸️", color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.15)" },
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
            aria-label="Search departments"
            placeholder="Search departments..."
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
          <LoadError message={loadError} onRetry={fetchDepartments} />
        </div>
      ) : (
        <DepartmentTable
          departments={filteredDepartments}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyTitle={search ? "No departments match your search" : undefined}
          emptyDescription={search ? "Try a different department name or description." : undefined}
        />
      )}

      {/* Modals */}
      <DepartmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        department={editingDepartment}
        refreshDepartments={fetchDepartments}
      />
      <DeleteDepartmentModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        department={selectedDepartment}
        refreshDepartments={fetchDepartments}
      />
    </div>
  );
}
