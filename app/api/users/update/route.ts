import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getErrorMessage } from "@/lib/errors";

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

    // ── Duplicate checks (exclude current user's own doc) ────────────────
    const usersRef = adminDb.collection("users");

    // 1. Duplicate email
    const emailSnap = await usersRef.where("email", "==", email).get();
    const emailTaken = emailSnap.docs.some((d) => d.id !== uid);
    if (emailTaken) {
      return NextResponse.json(
        { success: false, message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // 2. Duplicate employeeId (only if provided)
    if (employeeId?.trim()) {
      const empSnap = await usersRef.where("employeeId", "==", employeeId.trim()).get();
      const empTaken = empSnap.docs.some((d) => d.id !== uid);
      if (empTaken) {
        return NextResponse.json(
          { success: false, message: "A user with this Employee ID already exists." },
          { status: 409 }
        );
      }
    }
    // ─────────────────────────────────────────────────────────────────────

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
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error, "Failed to update user."),
      },
      { status: 500 }
    );
  }
}
