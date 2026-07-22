export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id?: string;
  employeeId: string;
  employeeName: string;
  userId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewedAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}
