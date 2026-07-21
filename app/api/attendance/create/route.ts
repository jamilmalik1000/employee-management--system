import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      employeeId,
      employeeName,
      date,
      status,
      checkIn,
      checkOut,
      remarks,
    } = body;

    if (!employeeId || !employeeName || !date || !status) {
      return NextResponse.json(
        { message: "Employee, date and status are required." },
        { status: 400 }
      );
    }

    // Prevent duplicate attendance for the same employee on the same date
    const existing = await adminDb
      .collection("attendance")
      .where("employeeId", "==", employeeId)
      .where("date", "==", date)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { message: "Attendance for this employee has already been marked for this date." },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("attendance").add({
      employeeId,
      employeeName,
      date,
      status,
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      remarks: remarks?.trim() || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Attendance marked successfully.", id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Attendance Error:", error);

    return NextResponse.json(
      { message: "Failed to mark attendance." },
      { status: 500 }
    );
  }
}
