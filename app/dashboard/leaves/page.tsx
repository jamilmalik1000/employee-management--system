"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Loader2, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/Context/AuthContext";
import { todayLocalISO } from "@/lib/date";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import ActionsMenu from "@/components/ActionsMenu";

type EmployeeLink = { id: string; name: string };

const statusStyle: Record<LeaveStatus, { color: string; background: string }> = {
  Pending: { color: "#d97706", background: "#fffbeb" },
  Approved: { color: "#059669", background: "#ecfdf5" },
  Rejected: { color: "#dc2626", background: "#fef2f2" },
};

export default function LeavesPage() {
  return <RoleGuard allowedRoles={["admin", "hr", "employee"]}><LeaveContent /></RoleGuard>;
}

function LeaveContent() {
  const { role, user, loading: authLoading } = useAuth();
  const management = role === "admin" || role === "hr";
  const [employee, setEmployee] = useState<EmployeeLink | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    if (authLoading || !user) return;
    setLoading(true);
    try {
      let own: EmployeeLink | null = null;
      if (!management) {
        const empRes = await fetch(`/api/employees/list?userId=${encodeURIComponent(user.uid)}`);
        const employees = await empRes.json();
        own = Array.isArray(employees) && employees[0] ? { id: employees[0].id, name: employees[0].name } : null;
        setEmployee(own);
      }
      const url = own ? `/api/leaves/list?employeeId=${encodeURIComponent(own.id)}` : "/api/leaves/list";
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLeaves(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load leave requests.");
    } finally { setLoading(false); }
  }, [authLoading, management, user]);

  useEffect(() => { load(); }, [load]);

  const review = async (leave: LeaveRequest, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/leaves/review", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leave.id, status, reviewedBy: user?.email || role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      load();
    } catch (error: any) { toast.error(error.message || "Could not review leave."); }
  };

  const visible = useMemo(() => leaves.filter((leave) => {
    const term = search.toLowerCase();
    return (!filter || leave.status === filter) &&
      (!term || leave.employeeName.toLowerCase().includes(term) || leave.leaveType.toLowerCase().includes(term));
  }), [filter, leaves, search]);

  const counts = (status: LeaveStatus) => leaves.filter((leave) => leave.status === status).length;
  const pagination = usePagination(visible);

  return (
    <div className="page-root">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
        <div><h1 style={{ fontSize: "1.375rem", fontWeight: 800 }}>Leave Requests</h1><p style={{ color: "#64748b" }}>{management ? "Review employee leave and keep attendance synchronized" : "Request time off and track its approval"}</p></div>
        {!management && <button className="btn btn-primary" onClick={() => setModal(true)} disabled={!employee}><Plus size={16} /> Request Leave</button>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {(["Pending", "Approved", "Rejected"] as LeaveStatus[]).map((status) => <div className="card" key={status} style={{ padding: "1.25rem" }}><p style={{ fontSize: "1.6rem", fontWeight: 800, color: statusStyle[status].color }}>{counts(status)}</p><p style={{ color: "#64748b", fontWeight: 600 }}>{status}</p></div>)}
      </div>

      {!management && !loading && !employee && <div className="card" style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No employee profile is linked to this account. Contact HR before requesting leave.</div>}

      <div className="card" style={{ padding: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".75rem" }}>
        <div style={{ position: "relative" }}><Search size={15} style={{ position: "absolute", left: ".8rem", top: ".9rem", color: "#94a3b8" }} /><input className="form-input" style={{ paddingLeft: "2.3rem" }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or leave type" /></div>
        <select className="form-input" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? <div style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}><Loader2 className="animate-spin" style={{ margin: "auto" }} />Loading leave requests...</div> : visible.length === 0 ? <div style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}><CalendarDays size={42} style={{ margin: "0 auto .75rem" }} />No leave requests found.</div> :
          <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}><thead><tr style={{ background: "#f8fafc" }}>{["Employee", "Type", "Dates", "Reason", "Status", ...(management ? ["Actions"] : [])].map((head) => <th key={head} style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".7rem", color: "#64748b", textTransform: "uppercase" }}>{head}</th>)}</tr></thead><tbody>{pagination.pageItems.map((leave) => <tr key={leave.id} style={{ borderTop: "1px solid #eef2f7" }}><td style={{ padding: "1rem", fontWeight: 700 }}>{leave.employeeName}</td><td style={{ padding: "1rem" }}>{leave.leaveType}</td><td style={{ padding: "1rem", whiteSpace: "nowrap" }}>{leave.startDate}{leave.endDate !== leave.startDate && ` – ${leave.endDate}`}</td><td style={{ padding: "1rem", color: "#64748b", maxWidth: 260 }}>{leave.reason}</td><td style={{ padding: "1rem" }}><span className="badge" style={statusStyle[leave.status]}>{leave.status === "Pending" && <Clock3 size={12} />}{leave.status}</span></td>{management && <td style={{ padding: "1rem" }}><div className="flex justify-center"><ActionsMenu details={{ title: `${leave.employeeName} · ${leave.leaveType} leave`, data: leave }} items={leave.status === "Pending" ? [{ label: "Approve", icon: Check, onClick: () => review(leave, "Approved") }, { label: "Reject", icon: X, danger: true, onClick: () => review(leave, "Rejected") }] : []} /></div></td>}</tr>)}</tbody></table></div>}
        {visible.length > 0 && <Pagination {...pagination} total={visible.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />}
      </div>
      {modal && employee && user && <LeaveModal employee={employee} userId={user.uid} onClose={() => setModal(false)} onSaved={() => { setModal(false); load(); }} />}
    </div>
  );
}

function LeaveModal({ employee, userId, onClose, onSaved }: { employee: EmployeeLink; userId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ leaveType: "Annual", startDate: todayLocalISO(), endDate: todayLocalISO(), reason: "" });
  const [saving, setSaving] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/leaves/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, employeeId: employee.id, employeeName: employee.name, userId }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message); toast.success(data.message); onSaved();
    } catch (error: any) { toast.error(error.message || "Could not submit leave request."); } finally { setSaving(false); }
  };
  return <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}><div className="card animate-slideUp" style={{ width: "100%", maxWidth: 520, padding: "1.5rem" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}><div><h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Request Leave</h2><p style={{ color: "#64748b" }}>{employee.name}</p></div><button className="btn btn-icon btn-secondary" onClick={onClose}><X size={16} /></button></div><form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}><label>Leave type<select className="form-input" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}><option>Annual</option><option>Sick</option><option>Casual</option><option>Unpaid</option><option>Other</option></select></label><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}><label>Start date<input className="form-input" type="date" min={todayLocalISO()} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value, endDate: e.target.value > form.endDate ? e.target.value : form.endDate })} required /></label><label>End date<input className="form-input" type="date" min={form.startDate} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></label></div><label>Reason<textarea className="form-input" rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Why do you need leave?" required /></label><div style={{ display: "flex", justifyContent: "flex-end", gap: ".75rem" }}><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving && <Loader2 size={15} className="animate-spin" />} Submit Request</button></div></form></div></div>;
}
