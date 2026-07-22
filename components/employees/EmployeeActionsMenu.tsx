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
  canManageSalary?: boolean;
}

export default function EmployeeActionsMenu({ employee, onEdit, onDelete, onAddSalary, onViewSalaryHistory, canManageSalary = false }: Props) {
  const detailsData = canManageSalary
    ? employee
    : Object.fromEntries(Object.entries(employee).filter(([key]) => key !== "basicSalary"));

  return <ActionsMenu details={{ title: employee.name || "Employee", data: detailsData }} items={[
    { label: "Edit employee", icon: Pencil, onClick: () => onEdit(employee) },
    ...(canManageSalary ? [
      { label: "Add salary", icon: Wallet, onClick: () => onAddSalary(employee) },
      { label: "Salary history", icon: History, onClick: () => onViewSalaryHistory(employee) },
    ] : []),
    { label: "Delete employee", icon: Trash2, danger: true, onClick: () => onDelete(employee) },
  ]} />;
}
