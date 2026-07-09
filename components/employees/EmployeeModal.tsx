"use client";

import { useEffect, useState } from "react";
import {
  X,
  Plus,
  User,
  Mail,
  Phone,
  BadgeCheck,
  Briefcase,
  Building2,
  Users,
  AlertCircle,
  Loader2,
  ToggleLeft,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Employee } from "@/types/employee";
import {
  labelStyle,
  inputWrap,
  iconStyle,
  inputBase,
  focusIn,
  focusOut,
} from "@/lib/ui";

interface Props {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  refreshEmployees: () => void;
}

const initialErrors = {
  name: "",
  email: "",
  phone: "",
};

export default function EmployeeModal({
  open,
  onClose,
  employee,
  refreshEmployees,
}: Props) {
  const isEdit = !!employee.id;

  const [form, setForm] = useState<Employee>(employee);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    setForm(employee);
    setErrors(initialErrors);
  }, [employee]);

  if (!open) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function validate() {
    const temp = { ...initialErrors };
    let valid = true;

    if (!form.name.trim()) {
      temp.name = "Employee name is required";
      valid = false;
    }

    if (!form.email.trim()) {
      temp.email = "Email is required";
      valid = false;
    }

    if (!form.phone.trim()) {
      temp.phone = "Phone number is required";
      valid = false;
    }

    setErrors(temp);

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const url = form.id
        ? "/api/employees/update"
        : "/api/employees/create";

      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save employee.");
      }

      toast.success(
        isEdit
          ? "Employee updated successfully!"
          : "Employee created successfully!"
      );

      refreshEmployees();

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save employee.");
    }

    setLoading(false);
  }

  return (
    <div
      className="animate-fadeIn"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1.5rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-slideUp w-full"
        style={{
          maxWidth: "640px",
          maxHeight: "95vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "1.25rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
        }}
      >
        {/* Gradient header */}
        <div
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            borderRadius: "1.25rem 1.25rem 0 0",
            padding: "1.75rem 2rem 1.5rem",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#fff",
                margin: 0,
              }}
            >
              {isEdit ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "#c4b5fd",
                marginTop: "0.375rem",
              }}
            >
              {isEdit
                ? "Update the employee's details and status"
                : "Fill in the details to create a new employee"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "2.25rem",
              height: "2.25rem",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.625rem",
              border: "none",
              cursor: "pointer",
              background: "rgba(255,255,255,0.12)",
              color: "#c4b5fd",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1.75rem 2rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Personal Information */}
          <div>
            <h3
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#6366f1",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 1rem",
              }}
            >
              Personal Information
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Employee Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={inputWrap}>
                  <User size={14} style={iconStyle} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
                {errors.name && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "0.75rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Email <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={inputWrap}>
                  <Mail size={14} style={iconStyle} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
                {errors.email && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "0.75rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Phone <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={inputWrap}>
                  <Phone size={14} style={iconStyle} />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 1234"
                    required
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
                {errors.phone && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "0.75rem",
                      marginTop: "0.375rem",
                    }}
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Gender</label>
                <div style={inputWrap}>
                  <Users size={14} style={iconStyle} />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    style={{
                      ...inputBase,
                      paddingLeft: "2.5rem",
                      paddingRight: "2.5rem",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown
                    size={14}
                    style={{
                      position: "absolute",
                      right: "0.875rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#94a3b8",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#f0f2f8" }} />

          {/* Employment Information */}
          <div>
            <h3
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#6366f1",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 1rem",
              }}
            >
              Employment Information
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>Department</label>
                <div style={inputWrap}>
                  <Building2 size={14} style={iconStyle} />
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. Engineering"
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Designation</label>
                <div style={inputWrap}>
                  <Briefcase size={14} style={iconStyle} />
                  <input
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Employment Type</label>
                <div style={inputWrap}>
                  <Briefcase size={14} style={iconStyle} />
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    style={{
                      ...inputBase,
                      paddingLeft: "2.5rem",
                      paddingRight: "2.5rem",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  >
                    <option value="">Select Type</option>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Intern</option>
                    <option>Contract</option>
                  </select>
                  <ChevronDown
                    size={14}
                    style={{
                      position: "absolute",
                      right: "0.875rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#94a3b8",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginTop: "1rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.875rem 1rem",
                  background: "#f8faff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "0.625rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="isLogin"
                  checked={form.isLogin}
                  onChange={handleChange}
                  style={{
                    width: "1rem",
                    height: "1rem",
                    accentColor: "#6366f1",
                    cursor: "pointer",
                  }}
                />
                <ToggleLeft size={16} color="#6366f1" />
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    Has Login
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      margin: 0,
                    }}
                  >
                    Can access the system
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.875rem 1rem",
                  background: "#f8faff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "0.625rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  style={{
                    width: "1rem",
                    height: "1rem",
                    accentColor: "#6366f1",
                    cursor: "pointer",
                  }}
                />
                <ToggleLeft size={16} color="#6366f1" />
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    Active
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      margin: 0,
                    }}
                  >
                    Employee is active
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.8125rem 1rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: "0.625rem",
                border: "1.5px solid #e2e8f0",
                background: "#f8faff",
                color: "#475569",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.8125rem 1rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                borderRadius: "0.625rem",
                border: "none",
                background: loading
                  ? "#818cf8"
                  : "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving…
                </>
              ) : isEdit ? (
                "Update Employee"
              ) : (
                <>
                  <Plus size={15} /> Create Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
