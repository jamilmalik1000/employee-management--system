import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { employeeId, employeeName, date, time } = await req.json();

    if (!employeeId || !employeeName || !date || !time) {
      return NextResponse.json(
        { message: "Employee, date and time are required." },
        { status: 400 }
      );
    }

    const existing = await adminDb
      .collection("attendance")
      .where("employeeId", "==", employeeId)
      .where("date", "==", date)
      .limit(1)
      .get();

    if (!existing.empty) {
      const record = existing.docs[0];
      if (record.data().checkIn) {
        return NextResponse.json(
          { message: "You have already checked in today." },
          { status: 400 }
        );
      }

      await record.ref.update({
        checkIn: time,
        status: "Present",
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ message: "Checked in successfully.", checkIn: time });
    }

    await adminDb.collection("attendance").add({
      employeeId,
      employeeName,
      date,
      status: "Present",
      checkIn: time,
      checkOut: "",
      remarks: "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Checked in successfully.", checkIn: time });
  } catch (error) {
    console.error("Check-In Error:", error);

    return NextResponse.json(
      { message: "Failed to check in." },
      { status: 500 }
    );
  }
}
