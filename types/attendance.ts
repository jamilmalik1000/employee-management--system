export type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day" | "Leave";

export interface Attendance {
  id?: string;

  employeeId: string;

  employeeName: string;

  date: string;

  status: AttendanceStatus | "";

  checkIn?: string;

  checkOut?: string;

  remarks?: string;

  createdAt?: any;

  updatedAt?: any;
}
