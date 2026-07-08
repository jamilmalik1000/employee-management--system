import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

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
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}