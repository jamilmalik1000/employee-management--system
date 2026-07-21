import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      status,
      checkIn,
      checkOut,
      remarks,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Attendance ID is required." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { message: "Status is required." },
        { status: 400 }
      );
    }

    const attendanceRef = adminDb.collection("attendance").doc(id);
    const attendanceDoc = await attendanceRef.get();

    if (!attendanceDoc.exists) {
      return NextResponse.json(
        { message: "Attendance record not found." },
        { status: 404 }
      );
    }

    await attendanceRef.update({
      status,
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      remarks: remarks?.trim() || "",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      message: "Attendance updated successfully.",
    });
  } catch (error) {
    console.error("Update Attendance Error:", error);

    return NextResponse.json(
      { message: "Failed to update attendance." },
      { status: 500 }
    );
  }
}
