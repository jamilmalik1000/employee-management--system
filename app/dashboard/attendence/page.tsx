"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, X, UserX } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceModal from "@/components/attendance/AttendanceModal";
import DeleteAttendanceModal from "@/components/attendance/DeleteAttendanceModal";
import CheckInOutCard from "@/components/attendance/CheckInOutCard";
import { Attendance } from "@/types/attendance";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";
import { todayLocalISO } from "@/lib/date";
import PageIntro from "@/components/ui/PageIntro";
import { AppLoader, LoadError } from "@/components/ui/AppState";
import PermissionGuard from "@/components/PermissionGuard";

const emptyAttendance: Attendance = {
  id: "", employeeId: "", employeeName: "", date: todayLocalISO(),
  status: "", checkIn: "", checkOut: "", remarks: "",
};

export default function AttendancePage() {
  return <PermissionGuard permission="attendance"><AttendanceContent /></PermissionGuard>;
}

function AttendanceContent() {
  const { role, user, permissions, loading: authLoading } = useAuth();

  if (authLoading) {
    return <AppLoader label="Loading attendance…" />;
  }

  const isManagement = role === "admin" || role === "hr" || permissions.includes("employees");

  return isManagement ? <ManagementView /> : <SelfServiceView userId={user?.uid} />;
}

/* ---------------------------------------------------------------------- */
/* Admin / HR — manage attendance for every employee                       */
/* ---------------------------------------------------------------------- */

function ManagementView() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance>(emptyAttendance);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(todayLocalISO());
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/attendance/list");

      if (!res.ok) {
        let message = "Failed to load attendance records.";
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
        throw new Error("The attendance list returned an invalid response.");
      }

      setAttendance(data);
    } catch (err) {
      console.error(err);
      setLoadError(err instanceof Error ? err.message : "Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, []);

  const handleAdd = () => { setEditingAttendance({ ...emptyAttendance, date: todayLocalISO() }); setOpenModal(true); };
  const handleEdit = (record: Attendance) => { setEditingAttendance(record); setOpenModal(true); };
  const handleDelete = (record: Attendance) => { setSelectedAttendance(record); setDeleteModal(true); };

  const today = todayLocalISO();
  const todayRecords = useMemo(() => attendance.filter((a) => a.date === today), [attendance, today]);
  const presentToday = todayRecords.filter((a) => a.status === "Present" || a.status === "Late").length;
  const absentToday  = todayRecords.filter((a) => a.status === "Absent").length;
  const lateToday    = todayRecords.filter((a) => a.status === "Late").length;
  const leaveToday   = todayRecords.filter((a) => a.status === "Leave").length;

  const filteredAttendance = useMemo(() => {
    const keyword = search.toLowerCase();
    return attendance.filter((record) => {
      const matchesSearch = record.employeeName.toLowerCase().includes(keyword);
      const matchesDate = dateFilter === "" || record.date === dateFilter;
      const matchesStatus = statusFilter === "" || record.status === statusFilter;
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [attendance, search, dateFilter, statusFilter]);

  return (
    <div className="page-root">

      <PageIntro description="Track and manage daily attendance records" actions={
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={16} />
          Add Attendance
        </button>
      } />

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Present Today", value: presentToday, icon: "✅", color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.15)" },
          { label: "Absent Today",  value: absentToday,  icon: "⛔", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)" },
          { label: "Late Today",    value: lateToday,    icon: "⏰", color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.15)" },
          { label: "On Leave Today", value: leaveToday,  icon: "📅", color: "#2563eb", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.15)" },
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
        style={{ padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.875rem", alignItems: "center" }}
      >
        <div style={inputWrap}>
          <Search size={14} style={iconStyle} />
          <input
            type="text"
            aria-label="Search attendance by employee"
            placeholder="Search by employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputBase}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div style={{ position: "relative" }}>
          <input
            type="date"
            aria-label="Filter attendance by date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ ...inputBase, paddingLeft: "0.875rem", paddingRight: dateFilter ? "2.25rem" : "0.875rem" }}
            onFocus={focusIn}
            onBlur={focusOut}
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter("")}
              aria-label="Clear date filter"
              title="Show all dates"
              style={{ position: "absolute", right: "0.25rem", top: "50%", transform: "translateY(-50%)", width: "2.25rem", height: "2.25rem", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "0.5rem", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <select
            aria-label="Filter attendance by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputBase, paddingLeft: "0.875rem", paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
            onFocus={focusIn}
            onBlur={focusOut}
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="Leave">Leave</option>
          </select>
          <span style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▾</span>
        </div>
      </div>

      {/* Table */}
      {loadError ? (
        <div className="card">
          <LoadError message={loadError} onRetry={fetchAttendance} />
        </div>
      ) : (
        <AttendanceTable
          attendance={filteredAttendance}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyTitle="No attendance matches your filters"
          emptyDescription="Adjust or clear the filters to see more attendance records."
        />
      )}

      {/* Modals */}
      <AttendanceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        attendance={editingAttendance}
        refreshAttendance={fetchAttendance}
      />
      <DeleteAttendanceModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        attendance={selectedAttendance}
        refreshAttendance={fetchAttendance}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Employee — self check-in / check-out + personal history                 */
/* ---------------------------------------------------------------------- */

function SelfServiceView({ userId }: { userId?: string }) {
  const [employee, setEmployee] = useState<{ id: string; name: string } | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadSelfService = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setLoadError("");
      setEmployee(null);
      setAttendance([]);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setLoadError("");
    setNotFound(false);

    try {
      const res = await fetch(`/api/employees/list?userId=${encodeURIComponent(userId)}`);

      if (!res.ok) {
        let message = "Failed to load your employee profile.";
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
        throw new Error("Your employee profile returned an invalid response.");
      }

      const own = data[0];

      if (!own) {
        setEmployee(null);
        setAttendance([]);
        setNotFound(true);
        return;
      }

      setEmployee({ id: own.id, name: own.name });

      const attRes = await fetch(`/api/attendance/list?employeeId=${encodeURIComponent(own.id)}`);

      if (!attRes.ok) {
        let message = "Failed to load your attendance history.";
        try {
          const errorData = (await attRes.json()) as { message?: string };
          message = errorData.message || message;
        } catch {
          // Keep the module-specific fallback when the error body is not JSON.
        }
        throw new Error(message);
      }

      const attData = await attRes.json();

      if (!Array.isArray(attData)) {
        throw new Error("Your attendance history returned an invalid response.");
      }

      setAttendance(attData);
    } catch (err) {
      console.error(err);
      setLoadError(err instanceof Error ? err.message : "Failed to load your attendance workspace.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadSelfService();
  }, [loadSelfService]);

  const refresh = async () => {
    if (!employee) return;

    setLoadError("");

    try {
      const attRes = await fetch(`/api/attendance/list?employeeId=${encodeURIComponent(employee.id)}`);

      if (!attRes.ok) {
        let message = "Failed to refresh your attendance history.";
        try {
          const errorData = (await attRes.json()) as { message?: string };
          message = errorData.message || message;
        } catch {
          // Keep the module-specific fallback when the error body is not JSON.
        }
        throw new Error(message);
      }

      const attData = await attRes.json();

      if (!Array.isArray(attData)) {
        throw new Error("Your attendance history returned an invalid response.");
      }

      setAttendance(attData);
    } catch (err) {
      console.error(err);
      setLoadError(err instanceof Error ? err.message : "Failed to refresh your attendance history.");
    }
  };

  const todayRecord = attendance.find((a) => a.date === todayLocalISO()) || null;

  return (
    <div className="page-root">

      <PageIntro description="Check in, check out, and review your attendance history" />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem 1rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading…</p>
        </div>
      ) : loadError ? (
        <div className="card">
          <LoadError message={loadError} onRetry={loadSelfService} />
        </div>
      ) : notFound || !employee ? (
        <div className="card" style={{ padding: "3rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", textAlign: "center" }}>
          <UserX size={40} color="#e2e8f0" />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", margin: 0 }}>No employee profile linked to your account</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", margin: 0 }}>Contact HR to link your account to an employee record.</p>
        </div>
      ) : (
        <>
          <CheckInOutCard
            employeeId={employee.id}
            employeeName={employee.name}
            todayRecord={todayRecord}
            onChange={refresh}
          />
          <AttendanceTable attendance={attendance} loading={false} readOnly />
        </>
      )}
    </div>
  );
}
