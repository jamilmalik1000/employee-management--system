import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");

    const snapshot = employeeId
      ? await adminDb.collection("attendance").where("employeeId", "==", employeeId).get()
      : await adminDb.collection("attendance").get();

    const attendance = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""));

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error("List Attendance Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch attendance records." },
      { status: 500 }
    );
  }
}
