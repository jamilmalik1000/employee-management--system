import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { datesInRange } from "@/lib/leave";

export async function POST(req: NextRequest) {
  try {
    const { employeeId, employeeName, userId, leaveType, startDate, endDate, reason } = await req.json();
    if (!employeeId || !employeeName || !userId || !leaveType || !startDate || !endDate || !reason?.trim()) {
      return NextResponse.json({ message: "All leave request fields are required." }, { status: 400 });
    }
    const dates = datesInRange(startDate, endDate);
    if (!dates.length || dates.length > 366) {
      return NextResponse.json({ message: "Choose a valid leave range of up to 366 days." }, { status: 400 });
    }

    const existing = await adminDb.collection("leaves").where("employeeId", "==", employeeId).get();
    const overlaps = existing.docs.some((doc) => {
      const leave = doc.data();
      return leave.status !== "Rejected" && leave.startDate <= endDate && leave.endDate >= startDate;
    });
    if (overlaps) return NextResponse.json({ message: "A leave request already overlaps these dates." }, { status: 409 });

    const ref = await adminDb.collection("leaves").add({
      employeeId, employeeName, userId, leaveType, startDate, endDate,
      reason: reason.trim(), status: "Pending",
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ message: "Leave request submitted.", id: ref.id }, { status: 201 });
  } catch (error) {
    console.error("Create Leave Error:", error);
    return NextResponse.json({ message: "Failed to submit leave request." }, { status: 500 });
  }
}
