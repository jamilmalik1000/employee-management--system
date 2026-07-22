import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { datesInRange } from "@/lib/leave";

export async function PUT(req: NextRequest) {
  try {
    const { id, status, reviewedBy } = await req.json();
    if (!id || !["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ message: "Leave ID and a valid decision are required." }, { status: 400 });
    }
    const leaveRef = adminDb.collection("leaves").doc(id);
    const leaveDoc = await leaveRef.get();
    if (!leaveDoc.exists) return NextResponse.json({ message: "Leave request not found." }, { status: 404 });
    const leave = leaveDoc.data()!;
    const dates = datesInRange(leave.startDate, leave.endDate);
    if (!dates.length || dates.length > 366) return NextResponse.json({ message: "The leave date range is invalid." }, { status: 400 });

    const attendance = await adminDb.collection("attendance").where("employeeId", "==", leave.employeeId).get();
    const byDate = new Map(attendance.docs.map((doc) => [doc.data().date, doc]));
    const batch = adminDb.batch();

    if (status === "Approved") {
      for (const date of dates) {
        const existing = byDate.get(date);
        const data = {
          employeeId: leave.employeeId, employeeName: leave.employeeName, date,
          status: "Leave", checkIn: "", checkOut: "",
          remarks: `${leave.leaveType} leave`, leaveRequestId: id,
          updatedAt: FieldValue.serverTimestamp(),
        };
        if (existing) batch.update(existing.ref, data);
        else batch.set(adminDb.collection("attendance").doc(), { ...data, createdAt: FieldValue.serverTimestamp() });
      }
    } else {
      attendance.docs
        .filter((doc) => doc.data().leaveRequestId === id)
        .forEach((doc) => batch.delete(doc.ref));
    }

    batch.update(leaveRef, {
      status, reviewedBy: reviewedBy || "Management",
      reviewedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();
    return NextResponse.json({ message: `Leave request ${status.toLowerCase()}.` });
  } catch (error) {
    console.error("Review Leave Error:", error);
    return NextResponse.json({ message: "Failed to review leave request." }, { status: 500 });
  }
}
