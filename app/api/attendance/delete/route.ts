import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Attendance ID is required." },
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

    await attendanceRef.delete();

    return NextResponse.json({
      message: "Attendance record deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Attendance Error:", error);

    return NextResponse.json(
      { message: "Failed to delete attendance record." },
      { status: 500 }
    );
  }
}
