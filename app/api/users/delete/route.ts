import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getErrorMessage } from "@/lib/errors";

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json(
        {
          success: false,
          message: "User UID is required.",
        },
        { status: 400 }
      );
    }

    // Delete Authentication user
    await adminAuth.deleteUser(uid);

    // Delete Firestore document
    await adminDb.collection("users").doc(uid).delete();

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error, "Failed to delete user."),
      },
      { status: 500 }
    );
  }
}
