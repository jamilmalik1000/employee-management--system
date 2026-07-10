import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    // Validate ID
    if (!id) {
      return NextResponse.json(
        {
          message: "Department ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const departmentRef = adminDb.collection("departments").doc(id);

    const departmentDoc = await departmentRef.get();

    if (!departmentDoc.exists) {
      return NextResponse.json(
        {
          message: "Department not found.",
        },
        {
          status: 404,
        }
      );
    }

    const departmentData = departmentDoc.data();
    const departmentName = departmentData?.name;

    // Check if any employee belongs to this department
    const employees = await adminDb
      .collection("employees")
      .where("department", "==", departmentName)
      .get();

    if (!employees.empty) {
      return NextResponse.json(
        {
          message:
            "Cannot delete this department because it is assigned to one or more employees.",
        },
        {
          status: 400,
        }
      );
    }

    await departmentRef.delete();

    return NextResponse.json({
      message: "Department deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Department Error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete department.",
      },
      {
        status: 500,
      }
    );
  }
}