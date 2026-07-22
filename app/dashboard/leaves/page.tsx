"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Loader2, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/Context/AuthContext";
import { todayLocalISO } from "@/lib/date";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import ActionsMenu from "@/components/ActionsMenu";
import PageIntro from "@/components/ui/PageIntro";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { LoadError } from "@/components/ui/AppState";
import { useDialog } from "@/hooks/useDialog";
import { getErrorMessage } from "@/lib/errors";

type EmployeeLink = { id: string; name: string };

const statusStyle: Record<LeaveStatus, { color: string; background: string }> = {
  Pending: { color: "var(--status-warning-text)", background: "rgba(217,119,6,.1)" },
  Approved: { color: "var(--status-success-text)", background: "rgba(5,150,105,.1)" },
  Rejected: { color: "var(--status-danger-text)", background: "rgba(239,68,68,.1)" },
};

export default function LeavesPage() {
  return <PermissionGuard permission="leaves"><LeaveContent /></PermissionGuard>;
}

function LeaveContent() {
  const { role, user, permissions, loading: authLoading } = useAuth();
  const management = role === "admin" || role === "hr" || permissions.includes("employees");
  const [employee, setEmployee] = useState<EmployeeLink | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [reviewTarget, setReviewTarget] = useState<{ leave: LeaveRequest; status: "Approved" | "Rejected" } | null>(null);
  const [reviewing, setReviewing] = useState(false);

  const load = useCallback(async () => {
    if (authLoading || !user) return;
    setLoading(true);
    setLoadError("");
    try {
      let own: EmployeeLink | null = null;
      if (!management) {
        const empRes = await fetch(`/api/employees/list?userId=${encodeURIComponent(user.uid)}`);
        if (!empRes.ok) {
          const errorData = await empRes.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to load your employee profile.");
        }
        const employees = await empRes.json();
        own = Array.isArray(employees) && employees[0] ? { id: employees[0].id, name: employees[0].name } : null;
        setEmployee(own);
        if (!own) {
          setLeaves([]);
          return;
        }
      }
      const url = management ? "/api/leaves/list" : `/api/leaves/list?employeeId=${encodeURIComponent(own!.id)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load leave requests.");
      if (!Array.isArray(data)) throw new Error("The leave list returned an invalid response.");
      setLeaves(data);
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Failed to load leave requests.");
    } finally { setLoading(false); }
  }, [authLoading, management, user]);

  useEffect(() => { load(); }, [load]);

  const review = async (leave: LeaveRequest, status: "Approved" | "Rejected") => {
    setReviewing(true);
    try {
      const res = await fetch("/api/leaves/review", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leave.id, status, reviewedBy: user?.email || role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      await load();
      setReviewTarget(null);
    } catch (error: unknown) { toast.error(getErrorMessage(error, "Could not review leave.")); }
    finally { setReviewing(false); }
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
      <PageIntro
        description={management ? "Review employee leave and keep attendance synchronized" : "Request time off and track its approval"}
        actions={!management && <button className="btn btn-primary" onClick={() => setModal(true)} disabled={!employee}><Plus size={16} /> Request Leave</button>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {(["Pending", "Approved", "Rejected"] as LeaveStatus[]).map((status) => <div className="card" key={status} style={{ padding: "1.25rem" }}><p style={{ fontSize: "1.6rem", fontWeight: 800, color: statusStyle[status].color }}>{loading || loadError ? "—" : counts(status)}</p><p style={{ color: "#64748b", fontWeight: 600 }}>{status}</p></div>)}
      </div>

      {!management && !loading && !loadError && !employee && <div className="card" style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No employee profile is linked to this account. Contact HR before requesting leave.</div>}

      <div className="card" style={{ padding: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".75rem" }}>
        <div style={{ position: "relative" }}><Search size={15} style={{ position: "absolute", left: ".8rem", top: ".9rem", color: "#94a3b8" }} /><input aria-label="Search leave requests" className="form-input" style={{ paddingLeft: "2.3rem" }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee or leave type" /></div>
        <select aria-label="Filter leave requests by status" className="form-input" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loadError ? (
          <LoadError message={loadError} onRetry={load} />
        ) : loading ? (
          <div className="app-state" role="status" aria-live="polite">
            <Loader2 className="animate-spin" />
            <p>Loading leave requests…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="app-state">
            <CalendarDays size={42} />
            <p>No leave requests found.</p>
          </div>
        ) : (
          <div
            className="table-scroll-region"
            role="region"
            aria-label="Leave requests table, scroll horizontally for more columns"
            tabIndex={0}
            style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr>
                  {["Employee", "Type", "Dates", "Reason", "Status", "Actions"].map((head) => (
                    <th
                      key={head}
                      className={head === "Reason" ? "hidden md:table-cell" : ""}
                      style={{ padding: ".9rem 1rem", textAlign: head === "Actions" ? "center" : "left", fontSize: ".7rem", textTransform: "uppercase" }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((leave) => (
                  <tr key={leave.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "1rem", fontWeight: 700 }}>{leave.employeeName}</td>
                    <td style={{ padding: "1rem" }}>{leave.leaveType}</td>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap" }}>
                      {leave.startDate}{leave.endDate !== leave.startDate && ` – ${leave.endDate}`}
                    </td>
                    <td className="hidden md:table-cell" style={{ padding: "1rem", color: "var(--color-text-secondary)", maxWidth: 260 }}>{leave.reason}</td>
                    <td style={{ padding: "1rem" }}>
                      <span className="badge" style={statusStyle[leave.status]}>
                        {leave.status === "Pending" && <Clock3 size={12} />}{leave.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div className="flex justify-center">
                        <ActionsMenu
                          details={{ title: `${leave.employeeName} · ${leave.leaveType} leave`, data: leave }}
                          items={management && leave.status === "Pending" ? [
                            { label: "Approve", icon: Check, onClick: () => setReviewTarget({ leave, status: "Approved" }) },
                            { label: "Reject", icon: X, danger: true, onClick: () => setReviewTarget({ leave, status: "Rejected" }) },
                          ] : []}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loadError && !loading && visible.length > 0 && (
          <Pagination {...pagination} total={visible.length} onPageChange={pagination.setPage} onPageSizeChange={pagination.setPageSize} />
        )}
      </div>
      {modal && employee && user && <LeaveModal employee={employee} userId={user.uid} onClose={() => setModal(false)} onSaved={() => { setModal(false); load(); }} />}
      <ConfirmDialog
        open={!!reviewTarget}
        title={reviewTarget?.status === "Approved" ? "Approve leave request?" : "Reject leave request?"}
        description={reviewTarget ? `${reviewTarget.leave.employeeName}'s ${reviewTarget.leave.leaveType.toLowerCase()} leave will be marked ${reviewTarget.status.toLowerCase()}.` : ""}
        confirmLabel={reviewTarget?.status === "Approved" ? "Approve request" : "Reject request"}
        danger={reviewTarget?.status === "Rejected"}
        busy={reviewing}
        onClose={() => setReviewTarget(null)}
        onConfirm={() => reviewTarget && review(reviewTarget.leave, reviewTarget.status)}
      />
    </div>
  );
}

function LeaveModal({ employee, userId, onClose, onSaved }: { employee: EmployeeLink; userId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ leaveType: "Annual", startDate: todayLocalISO(), endDate: todayLocalISO(), reason: "" });
  const [saving, setSaving] = useState(false);
  const dialogRef = useDialog<HTMLDivElement>(true, () => { if (!saving) onClose(); });
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/leaves/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, employeeId: employee.id, employeeName: employee.name, userId }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message); toast.success(data.message); onSaved();
    } catch (error: unknown) { toast.error(getErrorMessage(error, "Could not submit leave request.")); } finally { setSaving(false); }
  };
  return (
    <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-dialog-title"
        aria-describedby="leave-dialog-description"
        tabIndex={-1}
        className="card animate-slideUp"
        style={{ width: "100%", maxWidth: 520, maxHeight: "92dvh", overflowY: "auto", padding: "1.5rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <h2 id="leave-dialog-title" style={{ fontSize: "1.2rem", fontWeight: 800 }}>Request Leave</h2>
            <p id="leave-dialog-description" style={{ color: "var(--color-text-secondary)" }}>Submit a leave request for {employee.name}.</p>
          </div>
          <button type="button" aria-label="Close leave request" className="btn btn-icon btn-secondary" onClick={onClose} disabled={saving}>
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
          <label htmlFor="leave-type">Leave type</label>
          <select id="leave-type" className="form-input" value={form.leaveType} onChange={(event) => setForm({ ...form, leaveType: event.target.value })}>
            <option>Annual</option><option>Sick</option><option>Casual</option><option>Unpaid</option><option>Other</option>
          </select>
          <div className="form-grid-2">
            <div>
              <label htmlFor="leave-start-date">Start date</label>
              <input id="leave-start-date" className="form-input" type="date" min={todayLocalISO()} value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value, endDate: event.target.value > form.endDate ? event.target.value : form.endDate })} required />
            </div>
            <div>
              <label htmlFor="leave-end-date">End date</label>
              <input id="leave-end-date" className="form-input" type="date" min={form.startDate} value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} required />
            </div>
          </div>
          <label htmlFor="leave-reason">Reason</label>
          <textarea id="leave-reason" className="form-input" rows={4} value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="Why do you need leave?" required />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: ".75rem", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <Loader2 size={15} className="animate-spin" />} Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
