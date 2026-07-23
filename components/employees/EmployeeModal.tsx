"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  ContactRound,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  IdCard,
  Link2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import DesignationManagerModal from "@/components/employees/DesignationManagerModal";
import {
  normalizeEmployee,
  type BankDetails,
  type EmergencyContact,
  type Employee,
} from "@/types/employee";
import type { Designation } from "@/types/designation";

interface Props {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  refreshEmployees: () => void;
}

interface DepartmentOption {
  id?: string;
  name: string;
}

type FormErrors = Partial<
  Record<
    "name" | "email" | "phone" | "cnic" | "department" | "designation" | "employmentType" | "password",
    string
  >
>;

function Section({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 sm:p-5">
      <header className="mb-4 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </span>
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            {title}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  icon,
  required,
  error,
  wide,
  children,
}: {
  label: string;
  icon?: ReactNode;
  required?: boolean;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`block min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-bold text-[var(--color-text-secondary)]">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--color-text-muted)]">
            {icon}
          </span>
        )}
        {children}
      </span>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const controlClass =
  "form-input min-h-11 w-full bg-[var(--color-bg-surface-alt)] text-[var(--color-text-primary)]";
const iconControlClass = `${controlClass} pl-10`;

export default function EmployeeModal({
  open,
  onClose,
  employee,
  refreshEmployees,
}: Props) {
  const isEdit = Boolean(employee.id);
  const hadLoginBefore = Boolean(employee.userId);
  const [form, setForm] = useState(() => normalizeEmployee(employee));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [designationManagerOpen, setDesignationManagerOpen] = useState(false);

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const [departmentsResponse, designationsResponse] = await Promise.all([
        fetch("/api/departments/list"),
        fetch("/api/designations/list"),
      ]);
      const [departmentData, designationData] = await Promise.all([
        departmentsResponse.json(),
        designationsResponse.json(),
      ]);

      if (!departmentsResponse.ok) {
        throw new Error(departmentData.message || "Could not load departments.");
      }
      if (!designationsResponse.ok) {
        throw new Error(
          designationData.message || "Could not load designations."
        );
      }

      setDepartments(Array.isArray(departmentData) ? departmentData : []);
      setDesignations(Array.isArray(designationData) ? designationData : []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load employee form options."
      );
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    setForm(normalizeEmployee(employee));
    setPassword("");
    setShowPassword(false);
    setErrors({});
  }, [employee, open]);

  useEffect(() => {
    if (open) void loadOptions();
  }, [loadOptions, open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !designationManagerOpen) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [designationManagerOpen, onClose, open]);

  const availableDesignations = useMemo(
    () =>
      designations.filter(
        (designation) =>
          designation.isActive || designation.name === form.designation
      ),
    [designations, form.designation]
  );

  if (!open) return null;

  const setValue = (
    name: keyof Employee,
    value: Employee[keyof Employee]
  ) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const setBankValue = (name: keyof BankDetails, value: string) => {
    setForm((current) => ({
      ...current,
      bankDetails: { ...current.bankDetails, [name]: value },
    }));
  };

  const setEmergencyValue = (
    name: keyof EmergencyContact,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      emergencyContact: { ...current.emergencyContact, [name]: value },
    }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Employee name is required.";
    if (!form.cnic.trim()) nextErrors.cnic = "CNIC is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.department) nextErrors.department = "Department is required.";
    if (!form.designation) nextErrors.designation = "Designation is required.";
    if (!form.employmentType) {
      nextErrors.employmentType = "Employment type is required.";
    }
    if (form.isLogin && !hadLoginBefore && password.trim().length < 6) {
      nextErrors.password = "Enter a password of at least 6 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const response = await fetch(
        form.id ? "/api/employees/update" : "/api/employees/create",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            ...(password.trim() ? { password: password.trim() } : {}),
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save employee.");
      }
      toast.success(data.message);
      await refreshEmployees();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save employee."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
        onClick={(event) => event.target === event.currentTarget && onClose()}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-form-title"
          className="flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-bg-surface-alt)] shadow-2xl"
        >
          <header className="flex shrink-0 items-start justify-between gap-4 bg-[var(--gradient-brand)] px-4 py-4 text-white sm:px-7 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15">
                <CircleUserRound size={23} />
              </span>
              <div className="min-w-0">
                <h2
                  id="employee-form-title"
                  className="truncate text-lg font-bold sm:text-xl"
                >
                  {isEdit ? "Edit Employee Profile" : "Create Employee Profile"}
                </h2>
                <p className="text-xs text-white/75 sm:text-sm">
                  Personal, employment, payroll, and contact information
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15 transition hover:bg-white/25"
              aria-label="Close employee form"
            >
              <X size={18} />
            </button>
          </header>

          <form
            onSubmit={submit}
            className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5"
          >
            <div className="grid gap-4">
              <Section
                title="Employee profile"
                description="Identity and primary contact details"
                icon={<User size={18} />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Employee ID" icon={<BadgeCheck size={16} />}>
                    <input
                      className={`${iconControlClass} cursor-not-allowed opacity-75`}
                      value={form.employeeId || "Auto-generated after save"}
                      readOnly
                    />
                  </Field>
                  <Field
                    label="Name"
                    icon={<User size={16} />}
                    required
                    error={errors.name}
                  >
                    <input
                      className={iconControlClass}
                      value={form.name}
                      onChange={(event) => setValue("name", event.target.value)}
                      placeholder="Employee full name"
                      autoComplete="name"
                    />
                  </Field>
                  <Field
                    label="CNIC"
                    icon={<IdCard size={16} />}
                    required
                    error={errors.cnic}
                  >
                    <input
                      className={iconControlClass}
                      value={form.cnic}
                      onChange={(event) => setValue("cnic", event.target.value)}
                      placeholder="00000-0000000-0"
                    />
                  </Field>
                  <Field
                    label="Phone"
                    icon={<Phone size={16} />}
                    required
                    error={errors.phone}
                  >
                    <input
                      className={iconControlClass}
                      value={form.phone}
                      onChange={(event) => setValue("phone", event.target.value)}
                      placeholder="+92 300 0000000"
                      autoComplete="tel"
                    />
                  </Field>
                  <Field
                    label="Email"
                    icon={<Mail size={16} />}
                    required
                    error={errors.email}
                  >
                    <input
                      className={iconControlClass}
                      type="email"
                      value={form.email}
                      onChange={(event) => setValue("email", event.target.value)}
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field
                    label="Gender"
                    icon={<Users size={16} />}
                  >
                    <select
                      className={`${iconControlClass} appearance-none pr-10`}
                      value={form.gender}
                      onChange={(event) => setValue("gender", event.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  </Field>
                  <Field label="Profile photo URL" icon={<Link2 size={16} />}>
                    <input
                      className={iconControlClass}
                      type="url"
                      value={form.profilePhotoUrl}
                      onChange={(event) =>
                        setValue("profilePhotoUrl", event.target.value)
                      }
                      placeholder="https://example.com/photo.jpg"
                    />
                  </Field>
                  <Field
                    label="Address"
                    icon={<MapPin size={16} />}
                    wide
                  >
                    <textarea
                      className={`${iconControlClass} min-h-24 resize-y pt-3`}
                      value={form.address}
                      onChange={(event) =>
                        setValue("address", event.target.value)
                      }
                      placeholder="Complete residential address"
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="Employment information"
                description="Department, role, joining, and compensation"
                icon={<BriefcaseBusiness size={18} />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Department"
                    icon={<Building2 size={16} />}
                    required
                    error={errors.department}
                  >
                    <select
                      className={`${iconControlClass} appearance-none pr-10`}
                      value={form.department}
                      onChange={(event) =>
                        setValue("department", event.target.value)
                      }
                      disabled={optionsLoading}
                    >
                      <option value="">
                        {optionsLoading
                          ? "Loading departments..."
                          : "Select department"}
                      </option>
                      {departments.map((department) => (
                        <option
                          key={department.id || department.name}
                          value={department.name}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  </Field>

                  <Field
                    label="Designation"
                    required
                    error={errors.designation}
                  >
                    <div className="flex gap-2">
                      <span className="relative min-w-0 flex-1">
                        <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                        <select
                          className={`${iconControlClass} appearance-none pr-10`}
                          value={form.designation}
                          onChange={(event) =>
                            setValue("designation", event.target.value)
                          }
                          disabled={optionsLoading}
                        >
                          <option value="">
                            {optionsLoading
                              ? "Loading designations..."
                              : "Select designation"}
                          </option>
                          {form.designation &&
                            !availableDesignations.some(
                              (designation) =>
                                designation.name === form.designation
                            ) && (
                              <option value={form.designation}>
                                {form.designation} (Legacy)
                              </option>
                            )}
                          {availableDesignations.map((designation) => (
                            <option
                              key={designation.id || designation.name}
                              value={designation.name}
                            >
                              {designation.name}
                              {!designation.isActive ? " (Inactive)" : ""}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary shrink-0 px-3"
                        onClick={() => setDesignationManagerOpen(true)}
                        title="Manage designations"
                      >
                        <Plus size={16} />
                        <span className="hidden lg:inline">Manage</span>
                      </button>
                    </div>
                  </Field>

                  <Field
                    label="Qualification"
                    icon={<GraduationCap size={16} />}
                  >
                    <input
                      className={iconControlClass}
                      value={form.qualification}
                      onChange={(event) =>
                        setValue("qualification", event.target.value)
                      }
                      placeholder="e.g. BSc Computer Science"
                    />
                  </Field>
                  <Field
                    label="Joining date"
                    icon={<CalendarDays size={16} />}
                  >
                    <input
                      className={iconControlClass}
                      type="date"
                      value={form.joiningDate}
                      onChange={(event) =>
                        setValue("joiningDate", event.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Employment type"
                    icon={<BriefcaseBusiness size={16} />}
                    required
                    error={errors.employmentType}
                  >
                    <select
                      className={`${iconControlClass} appearance-none pr-10`}
                      value={form.employmentType}
                      onChange={(event) =>
                        setValue("employmentType", event.target.value)
                      }
                    >
                      <option value="">Select type</option>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                      <option>Intern</option>
                      <option>Probation</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  </Field>
                  <Field label="Salary" icon={<Banknote size={16} />}>
                    <input
                      className={iconControlClass}
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.basicSalary}
                      onChange={(event) =>
                        setValue(
                          "basicSalary",
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value)
                        )
                      }
                      placeholder="0.00"
                    />
                  </Field>
                  <Field label="Status" icon={<BadgeCheck size={16} />}>
                    <select
                      className={`${iconControlClass} appearance-none pr-10`}
                      value={form.isActive ? "active" : "inactive"}
                      onChange={(event) =>
                        setValue("isActive", event.target.value === "active")
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  </Field>
                </div>
              </Section>

              <Section
                title="Bank details"
                description="Account information used for payroll"
                icon={<Banknote size={18} />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Bank name">
                    <input
                      className={controlClass}
                      value={form.bankDetails.bankName}
                      onChange={(event) =>
                        setBankValue("bankName", event.target.value)
                      }
                      placeholder="Bank name"
                    />
                  </Field>
                  <Field label="Account title">
                    <input
                      className={controlClass}
                      value={form.bankDetails.accountTitle}
                      onChange={(event) =>
                        setBankValue("accountTitle", event.target.value)
                      }
                      placeholder="Account holder name"
                    />
                  </Field>
                  <Field label="Account number">
                    <input
                      className={controlClass}
                      value={form.bankDetails.accountNumber}
                      onChange={(event) =>
                        setBankValue("accountNumber", event.target.value)
                      }
                      placeholder="Account number"
                    />
                  </Field>
                  <Field label="IBAN">
                    <input
                      className={controlClass}
                      value={form.bankDetails.iban}
                      onChange={(event) =>
                        setBankValue("iban", event.target.value.toUpperCase())
                      }
                      placeholder="PK00 BANK 0000 0000 0000 0000"
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="Emergency contact"
                description="Person to contact in an emergency"
                icon={<ContactRound size={18} />}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Contact name">
                    <input
                      className={controlClass}
                      value={form.emergencyContact.name}
                      onChange={(event) =>
                        setEmergencyValue("name", event.target.value)
                      }
                      placeholder="Full name"
                    />
                  </Field>
                  <Field label="Relationship">
                    <input
                      className={controlClass}
                      value={form.emergencyContact.relationship}
                      onChange={(event) =>
                        setEmergencyValue("relationship", event.target.value)
                      }
                      placeholder="e.g. Spouse"
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      className={controlClass}
                      value={form.emergencyContact.phone}
                      onChange={(event) =>
                        setEmergencyValue("phone", event.target.value)
                      }
                      placeholder="+92 300 0000000"
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="Documents"
                description="Add document names and secure links"
                icon={<FileText size={18} />}
              >
                <div className="space-y-3">
                  {form.documents.map((document, index) => (
                    <div
                      key={`${index}-${document.name}`}
                      className="grid gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-3 sm:grid-cols-[0.8fr_1.4fr_auto]"
                    >
                      <input
                        className={controlClass}
                        value={document.name}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            documents: current.documents.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, name: event.target.value }
                                : item
                            ),
                          }))
                        }
                        placeholder="Document name"
                        aria-label={`Document ${index + 1} name`}
                      />
                      <input
                        className={controlClass}
                        type="url"
                        value={document.url}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            documents: current.documents.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, url: event.target.value }
                                : item
                            ),
                          }))
                        }
                        placeholder="https://..."
                        aria-label={`Document ${index + 1} URL`}
                      />
                      <button
                        type="button"
                        className="btn btn-icon btn-secondary text-red-600"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            documents: current.documents.filter(
                              (_, itemIndex) => itemIndex !== index
                            ),
                          }))
                        }
                        aria-label={`Remove document ${index + 1}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        documents: [
                          ...current.documents,
                          { name: "", url: "" },
                        ],
                      }))
                    }
                  >
                    <Plus size={15} /> Add document
                  </button>
                </div>
              </Section>

              <Section
                title="System access"
                description="Keep the existing employee login option"
                icon={<Lock size={18} />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] p-4">
                    <input
                      type="checkbox"
                      checked={form.isLogin}
                      onChange={(event) =>
                        setValue("isLogin", event.target.checked)
                      }
                      className="size-4 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-bold text-[var(--color-text-primary)]">
                        Has login
                      </span>
                      <span className="block text-xs text-[var(--color-text-muted)]">
                        Allow this employee to access the app
                      </span>
                    </span>
                  </label>

                  {form.isLogin && (
                    <Field
                      label={hadLoginBefore ? "New password (optional)" : "Password"}
                      icon={<Lock size={16} />}
                      required={!hadLoginBefore}
                      error={errors.password}
                    >
                      <input
                        className={`${iconControlClass} pr-10`}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setErrors((current) => ({
                            ...current,
                            password: undefined,
                          }));
                        }}
                        minLength={6}
                        autoComplete="new-password"
                        placeholder={
                          hadLoginBefore
                            ? "Leave blank to keep current password"
                            : "Minimum 6 characters"
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </Field>
                  )}
                </div>
              </Section>
            </div>

            <footer className="sticky bottom-0 z-10 mt-4 flex flex-wrap justify-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg-surface-alt)] py-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isEdit ? (
                  <Save size={16} />
                ) : (
                  <Plus size={16} />
                )}
                {saving
                  ? "Saving..."
                  : isEdit
                    ? "Save employee"
                    : "Create employee"}
              </button>
            </footer>
          </form>
        </section>
      </div>

      <DesignationManagerModal
        open={designationManagerOpen}
        onClose={() => setDesignationManagerOpen(false)}
        onChanged={() => void loadOptions()}
      />
    </>
  );
}
