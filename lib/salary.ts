import { SalaryRecord } from "@/types/salary";

export function currentSalaryMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function emptySalaryFor(employee: { id?: string; name: string; basicSalary?: number | "" }): SalaryRecord {
  return {
    id: "",
    employeeId: employee.id || "",
    employeeName: employee.name,
    month: currentSalaryMonth(),
    basicSalary: employee.basicSalary || "",
    allowances: "",
    deductions: "",
    bonus: "",
    status: "Pending",
    paymentDate: "",
    notes: "",
  };
}
