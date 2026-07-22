"use client";

import { useState } from "react";
import { LogIn, LogOut, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Attendance } from "@/types/attendance";
import { todayLocalISO, nowLocalTime } from "@/lib/date";
import { getErrorMessage } from "@/lib/errors";

interface Props {
  employeeId: string;
  employeeName: string;
  todayRecord: Attendance | null;
  onChange: () => void;
}

export default function CheckInOutCard({ employeeId, employeeName, todayRecord, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const hasCheckedIn  = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, employeeName, date: todayLocalISO(), time: nowLocalTime() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to check in.");
      toast.success(`Checked in at ${data.checkIn}`);
      onChange();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to check in."));
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, date: todayLocalISO(), time: nowLocalTime() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to check out.");
      toast.success(`Checked out at ${data.checkOut}`);
      onChange();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to check out."));
    }
    setLoading(false);
  };

  return (
    <div style={{ borderRadius: "1rem", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)", padding: "1.75rem 2rem", boxShadow: "0 4px 24px rgba(99,102,241,0.35)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-2rem", right: "-2rem", width: "8rem", height: "8rem", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

      <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, margin: "0 0 0.375rem" }}>{today}</p>

      {!hasCheckedIn && (
        <>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: "0 0 1rem" }}>You haven’t checked in yet</h2>
          <button
            onClick={handleCheckIn}
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "#fff", color: "#4f46e5", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1 }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            Check In
          </button>
        </>
      )}

      {hasCheckedIn && !hasCheckedOut && (
        <>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: "0 0 0.375rem" }}>Checked in at {todayRecord?.checkIn}</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", margin: "0 0 1rem" }}>Don’t forget to check out at the end of your day.</p>
          <button
            onClick={handleCheckOut}
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "#fff", color: "#4f46e5", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.75rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1 }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            Check Out
          </button>
        </>
      )}

      {hasCheckedIn && hasCheckedOut && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <CheckCircle2 size={22} color="#fff" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: 0 }}>Day complete</h2>
          </div>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", margin: "0.375rem 0 0" }}>
            Checked in at {todayRecord?.checkIn} · Checked out at {todayRecord?.checkOut}
          </p>
        </>
      )}
    </div>
  );
}
