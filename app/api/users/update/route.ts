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

    // Update Firestore — strip undefined values Firestore can't handle
    const firestoreData: Record<string, unknown> = {
      name,
      email,
      role,
      isActive,
      updatedAt: new Date(),
    };
    if (department !== undefined) firestoreData.department = department;
    if (employeeId !== undefined) firestoreData.employeeId = employeeId;

    await adminDb.collection("users").doc(uid).update(firestoreData);

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