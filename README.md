# Employee Management System (EMS)

A modern Employee Management System built with **Next.js**, **TypeScript**, **Firebase Authentication**, and **Cloud Firestore**. The system provides secure authentication, role-based access control, employee management, and an intuitive dashboard for managing organizational data.

---

## 🚀 Features

### 🔐 Authentication

- Firebase Authentication
- Secure Login
- Forgot Password (Email Reset)
- Role-Based Authentication
- Protected Routes

---

### 👥 User Management

Only **Admin** users can:

- Create Users
- View Users
- Update User Information
- Delete Users
- Change User Email
- Reset User Password
- Assign Roles

---

### 🏢 Employee Management

Complete Employee CRUD:

- Add Employee
- Edit Employee
- Delete Employee
- Search Employees
- Filter by Department
- Filter by Status

Employee Information includes:

- Employee ID (Auto Generated)
- Name
- Email
- Phone
- Department
- Designation
- Employment Type
- Gender
- Login Enabled
- Linked User Account
- Status
- Created Date
- Updated Date

Employees can exist **with or without login accounts**, making the system suitable for contract workers, interns, and other staff.

---

### 🛡 Role Management

Role CRUD:

- Create Role
- Edit Role
- Delete Role

Permissions are assigned using checkboxes.

Example permissions:

- Dashboard
- Users
- Employees
- Departments
- Attendance
- Leaves
- Reports
- Settings

The sidebar is dynamically generated based on the logged-in user's permissions.

---

### 📊 Dashboard

Dashboard Cards include:

- Total Employees
- Active Employees
- Inactive Employees
- Login Enabled Employees

---

## 🛠 Technology Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes

### Database

- Cloud Firestore

### Authentication

- Firebase Authentication
- Firebase Admin SDK

### Deployment

- Vercel

---

## 📂 Project Structure

```
app/
│
├── api/
│   ├── users/
│   ├── employees/
│   └── roles/
│
├── dashboard/
│   ├── users/
│   ├── employees/
│   └── roles/
│
components/
│
├── users/
├── employees/
└── roles/
│
context/
│
lib/
│   ├── firebase.ts
│   └── firebase-admin.ts
│
types/
│
services/
```

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=

FIREBASE_CLIENT_EMAIL=

FIREBASE_PRIVATE_KEY=
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/employee-management-system.git
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🚀 Deployment

The project is configured for deployment on **Vercel**.

Deploy steps:

1. Push the project to GitHub
2. Import the repository into Vercel
3. Configure Environment Variables
4. Deploy

---

## 🔒 Access Levels

### Admin

- Full System Access
- Manage Users
- Manage Employees
- Manage Roles
- Manage Departments
- View Reports
- Settings

---

### HR

- Dashboard
- Employees
- Attendance
- Leaves

---

### Employee

- Dashboard
- Profile
- My Leaves

---

## 📋 Current Modules

- Authentication
- Dashboard
- User Management
- Employee Management
- Role Management
- Forgot Password
- Permission Management

---

## 🚧 Planned Features

- Department Management
- Attendance Management
- Leave Management
- Payroll
- Holiday Management
- Shift Management
- Notifications
- Reports & Analytics
- Employee Documents
- Profile Photos
- Audit Logs
- Activity Timeline
- Export to Excel & PDF
- Email Notifications

---

## 👨‍💻 Developed By

**Jamil Malik**

Software Engineer

---

## 📄 License

This project is intended for educational and portfolio purposes.