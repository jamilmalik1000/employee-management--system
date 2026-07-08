import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      uid,
      name,
      email,
      password,
      role,
      department,
      employeeId,
      isActive,
    } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "User UID is required." },
        { status: 400 }
      );
    }

    // Prepare Authentication update
    const authData: {
      email?: string;
      password?: string;
      displayName?: string;
      disabled?: boolean;
    } = {
      displayName: name,
      disabled: !isActive,
    };

    if (email) authData.email = email;
    if (password && password.trim() !== "") {
      authData.password = password;
    }

    // Update Firebase Authentication
    await adminAuth.updateUser(uid, authData);

    // Update Firestore
    await adminDb.collection("users").doc(uid).update({
      name,
      email,
      role,
      department,
      employeeId,
      isActive,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
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