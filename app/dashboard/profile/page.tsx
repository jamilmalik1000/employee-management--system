"use client";

import { CalendarDays, KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import PageIntro from "@/components/ui/PageIntro";
import { useAuth } from "@/Context/AuthContext";

export default function ProfilePage() {
  const { user, role, permissions } = useAuth();
  const name = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();
  const createdAt = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "Not available";

  return (
    <PermissionGuard permission="profile">
      <div className="page-root">
        <PageIntro description="Review your account, role and access permissions" />

        <div className="profile-grid">
          <section className="card profile-summary" aria-labelledby="profile-name">
            <div className="profile-avatar" aria-hidden="true">{initials}</div>
            <h2 id="profile-name">{name}</h2>
            <p>{user?.email}</p>
            <span className="profile-role"><ShieldCheck size={14} /> {role || "No role assigned"}</span>
          </section>

          <section className="card profile-details" aria-labelledby="account-details-title">
            <div className="section-heading">
              <div>
                <h2 id="account-details-title">Account details</h2>
                <p>Information associated with your sign-in account.</p>
              </div>
            </div>
            <dl>
              <div><dt><UserRound size={16} /> Display name</dt><dd>{name}</dd></div>
              <div><dt><Mail size={16} /> Email address</dt><dd>{user?.email || "Not available"}</dd></div>
              <div><dt><ShieldCheck size={16} /> Assigned role</dt><dd className="capitalize">{role || "Not assigned"}</dd></div>
              <div><dt><CalendarDays size={16} /> Account created</dt><dd>{createdAt}</dd></div>
            </dl>
          </section>
        </div>

        <section className="card access-card" aria-labelledby="access-title">
          <div className="section-heading">
            <div>
              <h2 id="access-title">Access permissions</h2>
              <p>Modules currently available to your account.</p>
            </div>
            <KeyRound size={20} />
          </div>
          <div className="permission-list">
            {permissions.length > 0
              ? permissions.map((permission) => <span key={permission}>{permission.replaceAll("_", " ")}</span>)
              : <p>No module permissions are currently assigned.</p>}
          </div>
        </section>
      </div>
    </PermissionGuard>
  );
}
