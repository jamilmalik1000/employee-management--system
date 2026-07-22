import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");

    const snapshot = employeeId
      ? await adminDb.collection("attendance").where("employeeId", "==", employeeId).get()
      : await adminDb.collection("attendance").get();

    const attendance: Array<Record<string, unknown> & { id: string }> = snapshot.docs
      .map<Record<string, unknown> & { id: string }>((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const aDate = typeof a.date === "string" ? a.date : "";
        const bDate = typeof b.date === "string" ? b.date : "";
        return bDate.localeCompare(aDate);
      });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error("List Attendance Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch attendance records." },
      { status: 500 }
    );
  }
}
