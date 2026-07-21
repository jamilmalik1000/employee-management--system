export type SalaryStatus = "Paid" | "Pending";

export interface SalaryRecord {
  id?: string;

  employeeId: string;

  employeeName: string;

  month: string;

  basicSalary: number | "";

  allowances: number | "";

  deductions: number | "";

  bonus: number | "";

  netSalary?: number;

  status: SalaryStatus | "";

  paymentDate?: string;

  notes?: string;

  createdAt?: any;

  updatedAt?: any;
}
