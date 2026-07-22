export type ExpenseCategory =
  | "Travel"
  | "Office Supplies"
  | "Utilities"
  | "Software"
  | "Maintenance"
  | "Other";

export type ExpenseStatus = "Pending" | "Approved" | "Rejected";

export interface Expense {
  id?: string;

  title: string;

  category: ExpenseCategory | "";

  amount: number | "";

  date: string;

  status: ExpenseStatus | "";

  notes?: string;

  createdAt?: any;

  updatedAt?: any;
}
