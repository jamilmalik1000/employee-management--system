import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");
    const snapshot = employeeId
      ? await adminDb.collection("leaves").where("employeeId", "==", employeeId).get()
      : await adminDb.collection("leaves").get();

    const leaves = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    return NextResponse.json(leaves);
  } catch (error) {
    console.error("List Leaves Error:", error);
    return NextResponse.json({ message: "Failed to fetch leave requests." }, { status: 500 });
  }
}
