import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getErrorMessage } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password, role, department, employeeId } = body;

    // ── Duplicate checks ──────────────────────────────────────────
    const usersRef = adminDb.collection("users");

    // 1. Check duplicate email in Firestore
    const emailSnap = await usersRef.where("email", "==", email).get();
    if (!emailSnap.empty) {
      return NextResponse.json(
        { success: false, message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // 2. Check duplicate employeeId (only if provided)
    if (employeeId?.trim()) {
      const empSnap = await usersRef.where("employeeId", "==", employeeId.trim()).get();
      if (!empSnap.empty) {
        return NextResponse.json(
          { success: false, message: "A user with this Employee ID already exists." },
          { status: 409 }
        );
      }
    }
    // ─────────────────────────────────────────────────────────────

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await usersRef.doc(userRecord.uid).set({
      name,
      email,
      role,
      department,
      employeeId,
      isActive: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error, "Failed to create user.") },
      { status: 500 }
    );
  }
}
