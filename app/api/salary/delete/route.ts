import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Salary record ID is required." },
        { status: 400 }
      );
    }

    const salaryRef = adminDb.collection("salary").doc(id);
    const salaryDoc = await salaryRef.get();

    if (!salaryDoc.exists) {
      return NextResponse.json(
        { message: "Salary record not found." },
        { status: 404 }
      );
    }

    await salaryRef.delete();

    return NextResponse.json({ message: "Salary record deleted successfully." });
  } catch (error) {
    console.error("Delete Salary Error:", error);

    return NextResponse.json(
      { message: "Failed to delete salary record." },
      { status: 500 }
    );
  }
}
