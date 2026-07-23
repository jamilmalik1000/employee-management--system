import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Designation ID is required." },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("designations").doc(id);
    const designation = await ref.get();
    if (!designation.exists) {
      return NextResponse.json(
        { message: "Designation not found." },
        { status: 404 }
      );
    }

    const name = String(designation.data()?.name || "");
    const employees = name
      ? await adminDb
          .collection("employees")
          .where("designation", "==", name)
          .limit(1)
          .get()
      : null;

    if (employees && !employees.empty) {
      return NextResponse.json(
        {
          message:
            "This designation is assigned to an employee. Reassign that employee before deleting it.",
        },
        { status: 409 }
      );
    }

    await ref.delete();
    return NextResponse.json({
      message: "Designation deleted successfully.",
    });
  } catch (error) {
    console.error("Delete designation error:", error);
    return NextResponse.json(
      { message: "Failed to delete designation." },
      { status: 500 }
    );
  }
}
