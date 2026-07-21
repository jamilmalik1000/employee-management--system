import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          message: "Employee ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const employeeRef = adminDb.collection("employees").doc(id);

    const employeeDoc = await employeeRef.get();

    if (!employeeDoc.exists) {
      return NextResponse.json(
        {
          message: "Employee not found.",
        },
        {
          status: 404,
        }
      );
    }

    const employee = employeeDoc.data();

    // Prevent deleting linked employee
    if (employee?.userId) {
      return NextResponse.json(
        {
          message:
            "This employee has a login account. Remove or unlink the login account before deleting the employee.",
        },
        {
          status: 400,
        }
      );
    }

    await employeeRef.delete();

    return NextResponse.json({
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete employee.",
      },
      {
        status: 500,
      }
    );
  }
}