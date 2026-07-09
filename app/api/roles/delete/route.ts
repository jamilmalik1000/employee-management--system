import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Role ID is required." },
        { status: 400 }
      );
    }

    // Get the role document
    const roleDoc = await adminDb.collection("roles").doc(id).get();

    if (!roleDoc.exists) {
      return NextResponse.json(
        { message: "Role not found." },
        { status: 404 }
      );
    }

    const roleData = roleDoc.data();
    const roleName = roleData?.name;

    // Prevent deleting the admin role
    if (roleName?.toLowerCase() === "admin") {
      return NextResponse.json(
        { message: "The Admin role is protected and cannot be deleted." },
        { status: 403 }
      );
    }

    // Check if any user is using this role
    const users = await adminDb
      .collection("users")
      .where("role", "==", roleName)
      .get();

    if (!users.empty) {
      return NextResponse.json(
        {
          message:
            "Cannot delete this role because it is assigned to one or more users.",
        },
        { status: 400 }
      );
    }

    // Delete the role
    await adminDb.collection("roles").doc(id).delete();

    return NextResponse.json({
      message: "Role deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to delete role." },
      { status: 500 }
    );
  }
}