export interface Permissions {
  Dashboard: boolean;
  Users: boolean;
  Employees: boolean;
  Departments: boolean;
  Attendance: boolean;
  Leaves: boolean;
  Reports: boolean;
  Settings: boolean;
}

export interface Role {
  id?: string;
  name: string;
  description: string;
  permissions: Permissions;
}