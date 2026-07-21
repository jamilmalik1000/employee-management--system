export interface Employee {
  id?: string;

  employeeId: string;

  userId: string;

  isLogin: boolean;

  name: string;

  email: string;

  phone: string;

  department: string;

  designation: string;

  employmentType: string;

  gender: string;

  basicSalary: number | "";

  isActive: boolean;

  createdAt?: any;

  updatedAt?: any;
}