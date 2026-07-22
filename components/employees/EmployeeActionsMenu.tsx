"use client";

import { History, Pencil, Trash2, Wallet } from "lucide-react";
import ActionsMenu from "@/components/ActionsMenu";
import { Employee } from "@/types/employee";

interface Props {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onAddSalary: (employee: Employee) => void;
  onViewSalaryHistory: (employee: Employee) => void;
}

export default function EmployeeActionsMenu({ employee, onEdit, onDelete, onAddSalary, onViewSalaryHistory }: Props) {
  return <ActionsMenu details={{ title: employee.name || "Employee", data: employee }} items={[
    { label: "Edit employee", icon: Pencil, onClick: () => onEdit(employee) },
    { label: "Add salary", icon: Wallet, onClick: () => onAddSalary(employee) },
    { label: "Salary history", icon: History, onClick: () => onViewSalaryHistory(employee) },
    { label: "Delete employee", icon: Trash2, danger: true, onClick: () => onDelete(employee) },
  ]} />;
}
