"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X, UserX } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceModal from "@/components/attendance/AttendanceModal";
import DeleteAttendanceModal from "@/components/attendance/DeleteAttendanceModal";
import CheckInOutCard from "@/components/attendance/CheckInOutCard";
import { Attendance } from "@/types/attendance";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut } from "@/lib/ui";
import { todayLocalISO } from "@/lib/date";

const emptyAttendance: Attendance = {
  id: "", employeeId: "", employeeName: "", date: todayLocalISO(),
  status: "", checkIn: "", checkOut: "", remarks: "",
};

export default function AttendancePage() {
  const { role, user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="page-root">
        <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading…</p>
      </div>
    );
  }

  const isManagement = role === "admin" || role === "hr";

  return isManagement ? <ManagementView /> : <SelfServiceView userId={user?.uid} />;
}

/* ---------------------------------------------------------------------- */
/* Admin / HR — manage attendance for every employee                       */
/* ---------------------------------------------------------------------- */

function ManagementView() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance>(emptyAttendance);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(todayLocalISO());
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance/list");
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAttendance(); }, []);
  useEffect(() => {
    const selectedEmployee =
      new URLSearchParams(window.location.search).get("employeeId") || "";
    setEmployeeFilter(selectedEmployee);
    if (selectedEmployee) setDateFilter("");
  }, []);

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
      const matchesEmployee =
        employeeFilter === "" || record.employeeId === employeeFilter;
      const matchesDate = dateFilter === "" || record.date === dateFilter;
      const matchesStatus = statusFilter === "" || record.status === statusFilter;
      return matchesSearch && matchesEmployee && matchesDate && matchesStatus;
    });
  }, [attendance, search, employeeFilter, dateFilter, statusFilter]);

  return (
    <div className="page-root">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Attendance Management</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>Track and manage daily attendance records</p>
        </div>
        <button
          onClick={handleAdd}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
        >
          <Plus size={16} />
          Add Attendance
        </button>
      </div>

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
              <p style={{ fontSize: "1.625rem", fontWeight: 800, color: s.color, lineHeight: 1, margin: 0 }}>{s.value}</p>
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
              title="Show all dates"
              style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <select
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

      {employeeFilter && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          <span className="font-semibold">
            Showing attendance for the selected employee.
          </span>
          <button
            type="button"
            className="font-bold text-indigo-700 hover:text-indigo-900"
            onClick={() => {
              setEmployeeFilter("");
              window.history.replaceState(null, "", "/dashboard/attendence");
            }}
          >
            Show everyone
          </button>
        </div>
      )}

      {/* Table */}
      <AttendanceTable attendance={filteredAttendance} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

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

  useEffect(() => {
    if (!userId) { setLoading(false); setNotFound(true); return; }

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/employees/list?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        const own = Array.isArray(data) ? data[0] : null;

        if (!own) { setNotFound(true); setLoading(false); return; }

        setEmployee({ id: own.id, name: own.name });

        const attRes = await fetch(`/api/attendance/list?employeeId=${encodeURIComponent(own.id)}`);
        const attData = await attRes.json();
        setAttendance(Array.isArray(attData) ? attData : []);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      }
      setLoading(false);
    })();
  }, [userId]);

  const refresh = async () => {
    if (!employee) return;
    const attRes = await fetch(`/api/attendance/list?employeeId=${encodeURIComponent(employee.id)}`);
    const attData = await attRes.json();
    setAttendance(Array.isArray(attData) ? attData : []);
  };

  const todayRecord = attendance.find((a) => a.date === todayLocalISO()) || null;

  return (
    <div className="page-root">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>My Attendance</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>Check in, check out, and review your attendance history</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem 1rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading…</p>
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
