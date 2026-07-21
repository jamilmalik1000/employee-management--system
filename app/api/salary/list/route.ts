import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const employeeId = req.nextUrl.searchParams.get("employeeId");

    const snapshot = employeeId
      ? await adminDb.collection("salary").where("employeeId", "==", employeeId).get()
      : await adminDb.collection("salary").get();

    const salary = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => (b.month || "").localeCompare(a.month || ""));

    return NextResponse.json(salary, { status: 200 });
  } catch (error) {
    console.error("List Salary Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch salary records." },
      { status: 500 }
    );
  }
}
