"use client";

import { User } from "@/app/dashboard/users/page";
import UserRow from "./UserRow";
import { Users, Search } from "lucide-react";
import { useState } from "react";

interface UserTableProps {
  users: User[];
  loading: boolean;
  refreshUsers: () => void;
}

const COLS = [
  { label: "User",        cls: "" },
  { label: "Email",       cls: "hidden sm:table-cell" },
  { label: "Role",        cls: "" },
  { label: "Department",  cls: "hidden md:table-cell" },
  { label: "Employee ID", cls: "hidden lg:table-cell" },
  { label: "Status",      cls: "hidden sm:table-cell" },
  { label: "Actions",     cls: "text-center" },
];

export default function UserTable({ users, loading, refreshUsers }: UserTableProps) {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      (u.department || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card overflow-hidden">

      {/* ── Table toolbar ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid #f0f2f8" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.12)" }}
          >
            <Users size={15} style={{ color: "#6366f1" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">All Users</h2>
            {!loading && (
              <p className="text-xs text-slate-400">
                {filtered.length} of {users.length} {users.length === 1 ? "user" : "users"}
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0 w-full sm:w-60">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#94a3b8" }}
          />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="px-5 py-5 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-32 rounded" />
                <div className="skeleton h-2.5 w-48 rounded" />
              </div>
              <div className="skeleton h-5 w-16 rounded-full hidden sm:block" />
              <div className="skeleton h-5 w-20 rounded-full hidden md:block" />
              <div className="skeleton h-5 w-16 rounded-full hidden sm:block" />
              <div className="flex gap-2">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div className="skeleton w-8 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#fafbff", borderBottom: "1px solid #f0f2f8" }}>
                {COLS.map((c) => (
                  <th
                    key={c.label}
                    className={`px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${c.cls}`}
                    style={{ color: "#94a3b8" }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: "#f8f9ff", border: "1.5px dashed #e0e4f5" }}
                      >
                        <Users size={28} style={{ color: "#c7d2fe" }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-600 mb-0.5">
                          {search ? "No results found" : "No users yet"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {search
                            ? `No users match "${search}" — try a different search term`
                            : 'Click "Add User" to create the first one'}
                        </p>
                      </div>
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="btn btn-secondary text-xs px-3 py-1.5"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <UserRow key={user.id} user={user} refreshUsers={refreshUsers} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
