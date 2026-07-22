"use client";

import { useEffect, useState } from "react";
import {
  X,
  Plus,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Users,
  Loader2,
  ToggleLeft,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  DollarSign,
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
import { useDialog } from "@/hooks/useDialog";
import { useRemoteList } from "@/hooks/useRemoteList";
import { getErrorMessage } from "@/lib/errors";

interface Props {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  refreshEmployees: () => void;
  canManageSalary?: boolean;
}

const initialErrors = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

export default function EmployeeModal({
  open,
  onClose,
  employee,
  refreshEmployees,
  canManageSalary = false,
}: Props) {
  const isEdit = !!employee.id;
  const hadLoginBefore = !!employee.userId;
  const [form, setForm] = useState<Employee>(employee);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const requestClose = () => {
    if (!loading) onClose();
  };
  const dialogRef = useDialog<HTMLDivElement>(open, requestClose);

  /* departments for dropdown */
  const {
    items: departments,
    loading: deptLoading,
    error: deptError,
    retry: retryDepartments,
  } = useRemoteList<{ id?: string; name: string }>({
    open,
    url: "/api/departments/list",
    errorMessage: "Departments could not be loaded.",
  });

  useEffect(() => {
    setForm(employee);
    setPassword("");
    setShowPassword(false);
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

    if (form.isLogin && !hadLoginBefore && !password.trim()) {
      temp.password = "Password is required to set up login access";
      valid = false;
    }

    if (form.isLogin && password.trim() && password.trim().length < 6) {
      temp.password = "Password must be at least 6 characters";
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

      const body = {
        ...form,
        ...(password.trim() ? { password: password.trim() } : {}),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to save employee."));
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
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
        tabIndex={-1}
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
              id="employee-modal-title"
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
            type="button"
            aria-label="Close employee form"
            onClick={requestClose}
            disabled={loading}
            style={{
              width: "2.25rem",
              height: "2.25rem",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.625rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: "rgba(255,255,255,0.12)",
              color: "#c4b5fd",
              opacity: loading ? 0.55 : 1,
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
                <label htmlFor="employee-name" style={labelStyle}>
                  Employee Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={inputWrap}>
                  <User size={14} style={iconStyle} />
                  <input
                    id="employee-name"
                    autoComplete="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "employee-name-error" : undefined}
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
                {errors.name && (
                  <p
                    id="employee-name-error"
                    role="alert"
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
                <label htmlFor="employee-email" style={labelStyle}>
                  Email <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={inputWrap}>
                  <Mail size={14} style={iconStyle} />
                  <input
                    id="employee-email"
                    autoComplete="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "employee-email-error" : undefined}
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
                {errors.email && (
                  <p
                    id="employee-email-error"
                    role="alert"
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
                <label htmlFor="employee-phone" style={labelStyle}>
                  Phone <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={inputWrap}>
                  <Phone size={14} style={iconStyle} />
                  <input
                    id="employee-phone"
                    autoComplete="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 1234"
                    required
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "employee-phone-error" : undefined}
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
                {errors.phone && (
                  <p
                    id="employee-phone-error"
                    role="alert"
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
                <label htmlFor="employee-gender" style={labelStyle}>Gender</label>
                <div style={inputWrap}>
                  <Users size={14} style={iconStyle} />
                  <select
                    id="employee-gender"
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
                <label htmlFor="employee-department" style={labelStyle}>Department</label>
                <div style={inputWrap}>
                  <Building2 size={14} style={iconStyle} />
                  <select
                    id="employee-department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    disabled={deptLoading}
                    aria-describedby={deptError ? "employee-departments-error" : undefined}
                    style={{
                      ...inputBase,
                      paddingLeft: "2.5rem",
                      paddingRight: "2.5rem",
                      appearance: "none",
                      cursor: deptLoading ? "not-allowed" : "pointer",
                      opacity: deptLoading ? 0.7 : 1,
                    }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  >
                    <option value="">
                      {deptError ? "Departments unavailable" : deptLoading ? "Loading departments…" : "Select Department"}
                    </option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
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
                {deptError && (
                  <div id="employee-departments-error" role="alert" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginTop: "0.5rem", color: "#dc2626", fontSize: "0.75rem" }}>
                    <span>{deptError}</span>
                    <button type="button" onClick={retryDepartments} style={{ border: "none", background: "transparent", color: "#4f46e5", font: "inherit", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                      Retry
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="employee-designation" style={labelStyle}>Designation</label>
                <div style={inputWrap}>
                  <Briefcase size={14} style={iconStyle} />
                  <input
                    id="employee-designation"
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
                <label htmlFor="employee-employment-type" style={labelStyle}>Employment Type</label>
                <div style={inputWrap}>
                  <Briefcase size={14} style={iconStyle} />
                  <select
                    id="employee-employment-type"
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

              {canManageSalary && <div>
                <label htmlFor="employee-basic-salary" style={labelStyle}>Basic Salary</label>
                <div style={inputWrap}>
                  <DollarSign size={14} style={iconStyle} />
                  <input
                    id="employee-basic-salary"
                    type="number"
                    name="basicSalary"
                    value={form.basicSalary}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={inputBase}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </div>}
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
                htmlFor="employee-has-login"
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
                  id="employee-has-login"
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
                htmlFor="employee-active"
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
                  id="employee-active"
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

            {/* Login credentials */}
            {form.isLogin && (
              <div style={{ marginTop: "0.875rem" }}>
                <label htmlFor="employee-password" style={labelStyle}>
                  Password{" "}
                  {hadLoginBefore ? (
                    <span
                      style={{
                        color: "#94a3b8",
                        fontWeight: 500,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      (leave blank to keep current)
                    </span>
                  ) : (
                    <span style={{ color: "#ef4444" }}>*</span>
                  )}
                </label>
                <div style={inputWrap}>
                  <Lock size={14} style={iconStyle} />
                  <input
                    id="employee-password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={hadLoginBefore ? "••••••••" : "Min. 6 characters"}
                    required={!hadLoginBefore}
                    minLength={6}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "employee-password-error employee-password-hint" : "employee-password-hint"}
                    style={{ ...inputBase, paddingRight: "2.5rem" }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="employee-password-error" role="alert" style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.375rem" }}>
                    {errors.password}
                  </p>
                )}
                <p id="employee-password-hint" style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.375rem" }}>
                  This creates a real login account using the employee’s email above, with the{" "}
                  <strong>Employee</strong> role.
                </p>
              </div>
            )}

            {!form.isLogin && hadLoginBefore && (
              <div
                style={{
                  marginTop: "0.875rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: "0.625rem",
                }}
              >
                <p style={{ fontSize: "0.8125rem", color: "#dc2626", fontWeight: 600, margin: 0 }}>
                  ⚠️ Saving will permanently remove this employee’s login account.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={requestClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.8125rem 1rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: "0.625rem",
                border: "1.5px solid #e2e8f0",
                background: "#f8faff",
                color: "#475569",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
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
