"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CalendarCheck2,
  CalendarPlus,
  ContactRound,
  ExternalLink,
  FileText,
  History,
  IdCard,
  Loader2,
  Printer,
  ReceiptText,
  UserRound,
  X,
} from "lucide-react";
import type { Attendance, AttendanceStatus } from "@/types/attendance";
import { normalizeEmployee, type Employee } from "@/types/employee";

interface Props {
  employee: Employee | null;
  onClose: () => void;
  onViewPayslips: (employee: Employee) => void;
  onCreateLeave: (employee: Employee) => void;
}

function InfoGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
        <span className="grid size-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
          {icon}
        </span>
        {title}
      </h3>
      <dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Info({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | number;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="break-words text-sm font-semibold text-[var(--color-text-primary)]">
        {value === "" || value === undefined ? "—" : value}
      </dd>
    </div>
  );
}

const attendanceMeta: Record<
  AttendanceStatus,
  { label: string; color: string; background: string }
> = {
  Present: {
    label: "Present",
    color: "#047857",
    background: "rgba(16,185,129,.1)",
  },
  Absent: {
    label: "Absent",
    color: "#dc2626",
    background: "rgba(239,68,68,.1)",
  },
  Late: {
    label: "Late",
    color: "#b45309",
    background: "rgba(245,158,11,.12)",
  },
  "Half Day": {
    label: "Half day",
    color: "#7c3aed",
    background: "rgba(139,92,246,.1)",
  },
  Leave: {
    label: "Leave",
    color: "#2563eb",
    background: "rgba(59,130,246,.1)",
  },
};

function currentMonthPrefix() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatSalary(value: number | "") {
  if (value === "") return "—";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function EmployeeDetailsModal({
  employee,
  onClose,
  onViewPayslips,
  onCreateLeave,
}: Props) {
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const profile = employee ? normalizeEmployee(employee) : null;

  useEffect(() => {
    if (!employee?.id) return;
    let active = true;
    setAttendanceLoading(true);
    fetch(
      `/api/attendance/list?employeeId=${encodeURIComponent(employee.id)}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (active) setAttendance(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setAttendance([]);
      })
      .finally(() => {
        if (active) setAttendanceLoading(false);
      });

    return () => {
      active = false;
    };
  }, [employee?.id]);

  useEffect(() => {
    if (!employee) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [employee, onClose]);

  const monthlyAttendance = useMemo(() => {
    const month = currentMonthPrefix();
    return attendance.filter((record) => record.date?.startsWith(month));
  }, [attendance]);

  const attendanceCounts = useMemo(
    () =>
      (Object.keys(attendanceMeta) as AttendanceStatus[]).map((status) => ({
        status,
        count: monthlyAttendance.filter((record) => record.status === status)
          .length,
      })),
    [monthlyAttendance]
  );

  if (!profile) return null;

  const initials =
    profile.name
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EP";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-details-title"
        className="employee-profile-print flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-bg-surface-alt)] shadow-2xl"
      >
        <header className="relative shrink-0 overflow-hidden bg-[var(--gradient-brand)] px-4 py-5 text-white sm:px-7 sm:py-7">
          <div className="absolute -right-16 -top-24 size-64 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div
                className="grid size-16 shrink-0 place-items-center rounded-2xl border border-white/25 bg-white/15 bg-cover bg-center text-xl font-black shadow-lg sm:size-20 sm:text-2xl"
                style={
                  profile.profilePhotoUrl
                    ? { backgroundImage: `url("${profile.profilePhotoUrl}")` }
                    : undefined
                }
              >
                {!profile.profilePhotoUrl && initials}
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h2
                    id="employee-details-title"
                    className="truncate text-xl font-extrabold sm:text-2xl"
                  >
                    {profile.name}
                  </h2>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      profile.isActive
                        ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-50"
                        : "border-red-300/40 bg-red-400/20 text-red-50"
                    }`}
                  >
                    {profile.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white/85">
                  {profile.designation || "No designation"} ·{" "}
                  {profile.department || "No department"}
                </p>
                <p className="mt-1 text-xs text-white/65">
                  {profile.employeeId || "Employee ID pending"} ·{" "}
                  {profile.employmentType || "Employment type not set"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15 transition hover:bg-white/25"
              aria-label="Close employee details"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1.35fr_.85fr]">
            <div className="grid content-start gap-4">
              <InfoGroup title="Personal information" icon={<UserRound size={16} />}>
                <Info label="Employee ID" value={profile.employeeId} />
                <Info label="CNIC" value={profile.cnic} />
                <Info label="Phone" value={profile.phone} />
                <Info label="Email" value={profile.email} />
                <Info label="Gender" value={profile.gender} />
                <Info label="Address" value={profile.address} wide />
              </InfoGroup>

              <InfoGroup
                title="Employment information"
                icon={<IdCard size={16} />}
              >
                <Info label="Department" value={profile.department} />
                <Info label="Designation" value={profile.designation} />
                <Info label="Qualification" value={profile.qualification} />
                <Info label="Joining date" value={profile.joiningDate} />
                <Info label="Employment type" value={profile.employmentType} />
                <Info label="Salary" value={formatSalary(profile.basicSalary)} />
                <Info
                  label="Login access"
                  value={profile.isLogin ? "Enabled" : "Disabled"}
                />
                <Info
                  label="Status"
                  value={profile.isActive ? "Active" : "Inactive"}
                />
              </InfoGroup>

              <InfoGroup title="Bank details" icon={<Banknote size={16} />}>
                <Info label="Bank name" value={profile.bankDetails.bankName} />
                <Info
                  label="Account title"
                  value={profile.bankDetails.accountTitle}
                />
                <Info
                  label="Account number"
                  value={profile.bankDetails.accountNumber}
                />
                <Info label="IBAN" value={profile.bankDetails.iban} />
              </InfoGroup>

              <InfoGroup
                title="Emergency contact"
                icon={<ContactRound size={16} />}
              >
                <Info label="Name" value={profile.emergencyContact.name} />
                <Info
                  label="Relationship"
                  value={profile.emergencyContact.relationship}
                />
                <Info label="Phone" value={profile.emergencyContact.phone} />
              </InfoGroup>
            </div>

            <aside className="grid content-start gap-4">
              <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      <CalendarCheck2 size={17} className="text-indigo-600" />
                      Attendance this month
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {new Date().toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {monthlyAttendance.length} records
                  </span>
                </div>

                {attendanceLoading ? (
                  <div className="grid min-h-32 place-items-center text-[var(--color-text-muted)]">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                    {attendanceCounts.map(({ status, count }) => {
                      const meta = attendanceMeta[status];
                      return (
                        <div
                          key={status}
                          className="rounded-xl p-3"
                          style={{ background: meta.background }}
                        >
                          <p
                            className="text-xl font-extrabold"
                            style={{ color: meta.color }}
                          >
                            {count}
                          </p>
                          <p
                            className="text-[11px] font-bold"
                            style={{ color: meta.color }}
                          >
                            {meta.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="employee-quick-actions rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5">
                <h3 className="mb-4 text-sm font-bold text-[var(--color-text-primary)]">
                  Quick actions
                </h3>
                <div className="grid gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                    onClick={() => {
                      onClose();
                      router.push(
                        `/dashboard/attendence?employeeId=${encodeURIComponent(profile.id || "")}`
                      );
                    }}
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                      <History size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[var(--color-text-primary)]">
                        View attendance
                      </span>
                      <span className="block text-xs text-[var(--color-text-muted)]">
                        Open this employee&apos;s records
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                    onClick={() => {
                      onClose();
                      onViewPayslips(profile);
                    }}
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-violet-100 text-violet-700">
                      <ReceiptText size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[var(--color-text-primary)]">
                        View payslips
                      </span>
                      <span className="block text-xs text-[var(--color-text-muted)]">
                        Review salary and payment history
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                    onClick={() => {
                      onClose();
                      onCreateLeave(profile);
                    }}
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-blue-700">
                      <CalendarPlus size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[var(--color-text-primary)]">
                        Create leave request
                      </span>
                      <span className="block text-xs text-[var(--color-text-muted)]">
                        Submit a request for this employee
                      </span>
                    </span>
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  <FileText size={17} className="text-indigo-600" />
                  Documents
                </h3>
                {profile.documents.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[var(--color-border)] p-5 text-center text-xs text-[var(--color-text-muted)]">
                    No documents have been added.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {profile.documents.map((document, index) => (
                      <a
                        key={`${document.name}-${index}`}
                        href={document.url || undefined}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] p-3 text-sm font-semibold text-[var(--color-text-primary)] ${
                          document.url
                            ? "transition hover:border-indigo-300 hover:text-indigo-600"
                            : "pointer-events-none opacity-60"
                        }`}
                      >
                        <span className="truncate">
                          {document.name || `Document ${index + 1}`}
                        </span>
                        <ExternalLink size={14} className="shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </aside>
          </div>
        </div>

        <footer className="employee-profile-actions flex shrink-0 flex-wrap justify-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3 sm:px-6">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <Printer size={15} /> Print profile
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}
