"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2, MapPin, Mail, Phone, DollarSign, Clock, AlertCircle, Loader2, Save,
} from "lucide-react";
import { toast } from "sonner";
import { CompanySettings } from "@/types/settings";
import { inputBase, iconStyle, inputWrap, focusIn, focusOut, labelStyle } from "@/lib/ui";
import { AppLoader, LoadError } from "@/components/ui/AppState";

const emptySettings: CompanySettings = {
  companyName: "", address: "", email: "", phone: "", currency: "USD", timezone: "",
};

const CURRENCY_OPTIONS = ["USD", "PKR", "EUR", "GBP", "INR", "AED", "CAD", "AUD"];

export default function SettingsForm() {
  const [form, setForm] = useState<CompanySettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const res = await fetch("/api/settings");

      if (!res.ok) {
        let message = "Failed to load company settings.";
        try {
          const errorData = (await res.json()) as { message?: string };
          message = errorData.message || message;
        } catch {
          // Keep the module-specific fallback when the error body is not JSON.
        }
        throw new Error(message);
      }

      const data = await res.json();

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("The company settings returned an invalid response.");
      }

      setForm({ ...emptySettings, ...data });
    } catch (err) {
      console.error(err);
      setLoadError(err instanceof Error ? err.message : "Failed to load company settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to save settings.");
      toast.success("Settings saved successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save settings.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card"><AppLoader label="Loading company settings…" /></div>
    );
  }

  if (loadError) {
    return (
      <div className="card">
        <LoadError message={loadError} onRetry={loadSettings} />
      </div>
    );
  }

  return (
    <div className="card settings-panel" style={{ padding: 0, overflow: "hidden" }}>
      <form onSubmit={handleSubmit} aria-describedby={error ? "settings-form-error" : undefined} style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {error && (
          <div id="settings-form-error" role="alert" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", color: "#dc2626", fontSize: "0.875rem" }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
            <span>{error}</span>
          </div>
        )}

        {/* Company name */}
        <div>
          <label htmlFor="settings-company-name" style={labelStyle}>Company Name <span style={{ color: "#ef4444" }}>*</span></label>
          <div style={inputWrap}>
            <Building2 size={14} style={iconStyle} />
            <input
              id="settings-company-name"
              autoComplete="organization"
              type="text" name="companyName" placeholder="e.g. Acme Corporation"
              value={form.companyName} onChange={handleChange} required
              aria-invalid={!!error && !form.companyName.trim()}
              aria-describedby={error && !form.companyName.trim() ? "settings-form-error" : undefined}
              style={inputBase} onFocus={focusIn} onBlur={focusOut}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="settings-address" style={labelStyle}>Address</label>
          <div style={inputWrap}>
            <MapPin size={14} style={iconStyle} />
            <input
              id="settings-address"
              autoComplete="street-address"
              type="text" name="address" placeholder="Street, City, Country"
              value={form.address} onChange={handleChange}
              style={inputBase} onFocus={focusIn} onBlur={focusOut}
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="form-grid-2">
          <div>
            <label htmlFor="settings-email" style={labelStyle}>Contact Email</label>
            <div style={inputWrap}>
              <Mail size={14} style={iconStyle} />
              <input
                id="settings-email"
                autoComplete="email"
                type="email" name="email" placeholder="contact@company.com"
                value={form.email} onChange={handleChange}
                style={inputBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>
          <div>
            <label htmlFor="settings-phone" style={labelStyle}>Contact Phone</label>
            <div style={inputWrap}>
              <Phone size={14} style={iconStyle} />
              <input
                id="settings-phone"
                autoComplete="tel"
                type="text" name="phone" placeholder="+1 555 000 1234"
                value={form.phone} onChange={handleChange}
                style={inputBase} onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>
        </div>

        {/* Currency + Timezone */}
        <div className="form-grid-2">
          <div>
            <label htmlFor="settings-currency" style={labelStyle}>Currency</label>
            <div style={inputWrap}>
              <DollarSign size={14} style={iconStyle} />
              <select
                id="settings-currency"
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
            <label htmlFor="settings-timezone" style={labelStyle}>Timezone</label>
            <div style={inputWrap}>
              <Clock size={14} style={iconStyle} />
              <input
                id="settings-timezone"
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
