export interface EmployeeDocument {
  name: string;
  url: string;
}

export interface BankDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id?: string;
  employeeId: string;
  userId: string;
  isLogin: boolean;
  profilePhotoUrl: string;
  name: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  designation: string;
  qualification: string;
  joiningDate: string;
  employmentType: string;
  gender: string;
  basicSalary: number | "";
  bankDetails: BankDetails;
  documents: EmployeeDocument[];
  emergencyContact: EmergencyContact;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export const emptyBankDetails: BankDetails = {
  bankName: "",
  accountTitle: "",
  accountNumber: "",
  iban: "",
};

export const emptyEmergencyContact: EmergencyContact = {
  name: "",
  relationship: "",
  phone: "",
};

export function createEmptyEmployee(): Employee {
  return {
    employeeId: "",
    userId: "",
    isLogin: false,
    profilePhotoUrl: "",
    name: "",
    cnic: "",
    phone: "",
    email: "",
    address: "",
    department: "",
    designation: "",
    qualification: "",
    joiningDate: "",
    employmentType: "",
    gender: "",
    basicSalary: "",
    bankDetails: { ...emptyBankDetails },
    documents: [],
    emergencyContact: { ...emptyEmergencyContact },
    isActive: true,
  };
}

export function normalizeEmployee(employee: Employee): Employee {
  return {
    ...createEmptyEmployee(),
    ...employee,
    bankDetails: {
      ...emptyBankDetails,
      ...(employee.bankDetails || {}),
    },
    emergencyContact: {
      ...emptyEmergencyContact,
      ...(employee.emergencyContact || {}),
    },
    documents: Array.isArray(employee.documents) ? employee.documents : [],
  };
}
