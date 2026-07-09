import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("users").get();

    const users = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id:         doc.id,
        name:       d.name        ?? "",
        email:      d.email       ?? "",
        role:       d.role        ?? "",
        department: d.department  ?? d.Department  ?? "",
        employeeId: d.employeeId  ?? d.employeeID  ?? d.EmployeeID ?? "",
        isActive:   d.isActive    ?? d.IsActive    ?? false,
      };
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}