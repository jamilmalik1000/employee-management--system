import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { employeeId, date, time } = await req.json();

    if (!employeeId || !date || !time) {
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

    if (existing.empty || !existing.docs[0].data().checkIn) {
      return NextResponse.json(
        { message: "You need to check in before you can check out." },
        { status: 400 }
      );
    }

    const record = existing.docs[0];

    if (record.data().status === "Leave") {
      return NextResponse.json(
        { message: "You are marked as on leave today and cannot check out." },
        { status: 400 }
      );
    }

    if (record.data().checkOut) {
      return NextResponse.json(
        { message: "You have already checked out today." },
        { status: 400 }
      );
    }

    await record.ref.update({
      checkOut: time,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Checked out successfully.", checkOut: time });
  } catch (error) {
    console.error("Check-Out Error:", error);

    return NextResponse.json(
      { message: "Failed to check out." },
      { status: 500 }
    );
  }
}
