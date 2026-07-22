import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

function timestampMillis(value: unknown): number {
  if (
    typeof value === "object" &&
    value !== null &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    const millis = value.toMillis();
    return typeof millis === "number" ? millis : 0;
  }

  return 0;
}

export async function GET(req: NextRequest) {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");
    const snapshot = employeeId
      ? await adminDb.collection("leaves").where("employeeId", "==", employeeId).get()
      : await adminDb.collection("leaves").get();

    const leaves: Array<Record<string, unknown> & { id: string }> = snapshot.docs
      .map<Record<string, unknown> & { id: string }>((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt));
    return NextResponse.json(leaves);
  } catch (error) {
    console.error("List Leaves Error:", error);
    return NextResponse.json({ message: "Failed to fetch leave requests." }, { status: 500 });
  }
}
