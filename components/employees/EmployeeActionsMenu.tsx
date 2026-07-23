"use client";

import { Eye, History, Pencil, Trash2, Wallet } from "lucide-react";
import ActionsMenu from "@/components/ActionsMenu";
import { Employee } from "@/types/employee";

interface Props {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onAddSalary: (employee: Employee) => void;
  onViewSalaryHistory: (employee: Employee) => void;
}

export default function EmployeeActionsMenu({ employee, onView, onEdit, onDelete, onAddSalary, onViewSalaryHistory }: Props) {
  return <ActionsMenu items={[
    { label: "View profile", icon: Eye, onClick: () => onView(employee) },
    { label: "Edit employee", icon: Pencil, onClick: () => onEdit(employee) },
    { label: "Add salary", icon: Wallet, onClick: () => onAddSalary(employee) },
    { label: "Salary history", icon: History, onClick: () => onViewSalaryHistory(employee) },
    { label: "Delete employee", icon: Trash2, danger: true, onClick: () => onDelete(employee) },
  ]} />;
}
