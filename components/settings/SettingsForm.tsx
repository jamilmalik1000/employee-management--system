"use client";

import { useEffect, useState } from "react";
import {
  Building2, MapPin, Mail, Phone, DollarSign, Clock, AlertCircle, Loader2, Save,
} from "lucide-react";
import { toast } from "sonner";
import { CompanySettings } from "@/types/settings";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut, labelStyle } from "@/lib/ui";

const emptySettings: CompanySettings = {
  companyName: "", address: "", email: "", phone: "", currency: "USD", timezone: "",
};

const CURRENCY_OPTIONS = ["USD", "PKR", "EUR", "GBP", "INR", "AED", "CAD", "AUD"];

export default function SettingsForm() {
  const [form, setForm] = useState<CompanySettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setForm({ ...emptySettings, ...data });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) { setError("Company name is required."); return; }

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save settings.");
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to save settings.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: "3rem 1.5rem", display: "flex", justifyContent: "center" }}>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <form onSubmit={handleSubmit} style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
            <span>{error}</span>
          </div>
        )}

        {/* Company name */}
        <div>
          <label style={labelStyle}>Company Name <span style={{ color: "#ef4444" }}>*</span></label>
          <div style={inputWrap}>
            <Building2 size={14} style={iconStyle} />
            <input
              type="text" name="companyName" placeholder="e.g. Acme Corporation"
              value={form.companyName} onChange={handleChange} required
              style={inputBase} onFocus={focusIn} onBlur={focusOut}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label style={labelStyle}>Address</label>
          <div style={inputWrap}>
            <MapPin size={14} style={iconStyle} />
            <input
              type="text" name="address" placeholder="Street, City, Country"
              value={form.address} onChange={handleChange}
              style={inputBase} onFocus={focusIn} onBlur={focusOut}
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Contact Email</label>
            <div style={inputWrap}>
              <Mail size={14} style={iconStyle} />
              <input
                type="email" name="email" placeholder="contact@company.com"
                value={form.email} onChange={handleChange}
                style={inputBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Contact Phone</label>
            <div style={inputWrap}>
              <Phone size={14} style={iconStyle} />
              <input
                type="text" name="phone" placeholder="+1 555 000 1234"
                value={form.phone} onChange={handleChange}
                style={inputBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>
        </div>

        {/* Currency + Timezone */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Currency</label>
            <div style={inputWrap}>
              <DollarSign size={14} style={iconStyle} />
              <select
                name="currency" value={form.currency} onChange={handleChange}
                style={{ ...inputBase, paddingRight: "2.5rem", appearance: "none", cursor: "pointer" }}
                onFocus={focusIn} onBlur={focusOut}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Timezone</label>
            <div style={inputWrap}>
              <Clock size={14} style={iconStyle} />
              <input
                type="text" name="timezone" placeholder="e.g. Asia/Karachi"
                value={form.timezone} onChange={handleChange}
                style={inputBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#f0f2f8" }} />

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit" disabled={saving}
            style={{ padding: "0.8125rem 1.5rem", fontSize: "0.9rem", fontWeight: 700, borderRadius: "0.625rem", border: "none", background: saving ? "#818cf8" : "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 14px rgba(99,102,241,0.35)", opacity: saving ? 0.75 : 1 }}
          >
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>

      </form>
    </div>
  );
}
