import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getErrorMessage } from "@/lib/errors";

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
  } catch (error: unknown) {
    return NextResponse.json(
      { message: getErrorMessage(error, "Failed to fetch users.") },
      { status: 500 }
    );
  }
}
