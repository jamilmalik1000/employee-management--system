import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      isLogin,
      password,
      name,
      email,
      phone,
      department,
      designation,
      employmentType,
      gender,
      basicSalary,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Employee ID is required." },
        { status: 400 }
      );
    }

    // Check employee exists
    const employeeRef = adminDb.collection("employees").doc(id);
    const employeeDoc = await employeeRef.get();

    if (!employeeDoc.exists) {
      return NextResponse.json(
        { message: "Employee not found." },
        { status: 404 }
      );
    }

    const existingData = employeeDoc.data();
    const previousUserId: string = existingData?.userId || "";
    const employeeId: string = existingData?.employeeId || "";

    // Email duplicate check
    const emailSnap = await adminDb
      .collection("employees")
      .where("email", "==", email)
      .get();

    const duplicateEmail = emailSnap.docs.find(
      (doc) => doc.id !== id
    );

    if (duplicateEmail) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    // Phone duplicate check
    const phoneSnap = await adminDb
      .collection("employees")
      .where("phone", "==", phone)
      .get();

    const duplicatePhone = phoneSnap.docs.find(
      (doc) => doc.id !== id
    );

    if (duplicatePhone) {
      return NextResponse.json(
        { message: "Phone number already exists." },
        { status: 400 }
      );
    }

    // Reconcile the login account with the isLogin toggle
    let userId = previousUserId;

    if (isLogin && previousUserId) {
      // Already has a login — sync details, optionally rotate the password
      try {
        const authUpdate: Record<string, unknown> = {
          email,
          displayName: name,
          disabled: false,
        };
        if (password && password.trim()) authUpdate.password = password.trim();

        await adminAuth.updateUser(previousUserId, authUpdate);
        await adminDb.collection("users").doc(previousUserId).update({
          name,
          email,
          department,
          employeeId,
          isActive: isActive ?? true,
          updatedAt: new Date(),
        });
      } catch (err: any) {
        return NextResponse.json(
          { message: err.message || "Failed to update login account." },
          { status: 400 }
        );
      }
    } else if (isLogin && !previousUserId) {
      // Enabling login for the first time
      if (!password || password.trim().length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters to set up login access." },
          { status: 400 }
        );
      }

      const usersRef = adminDb.collection("users");
      const existingUser = await usersRef.where("email", "==", email).limit(1).get();
      if (!existingUser.empty) {
        return NextResponse.json(
          { message: "A login account with this email already exists." },
          { status: 400 }
        );
      }

      try {
        const userRecord = await adminAuth.createUser({
          email,
          password: password.trim(),
          displayName: name,
        });
        userId = userRecord.uid;

        await usersRef.doc(userId).set({
          name,
          email,
          role: "employee",
          department,
          employeeId,
          isActive: isActive ?? true,
          createdAt: new Date(),
        });
      } catch (err: any) {
        return NextResponse.json(
          { message: err.message || "Failed to create login account." },
          { status: 400 }
        );
      }
    } else if (!isLogin && previousUserId) {
      // Revoking login entirely
      try {
        await adminAuth.deleteUser(previousUserId);
      } catch (err: any) {
        if (err.code !== "auth/user-not-found") {
          return NextResponse.json(
            { message: err.message || "Failed to remove login account." },
            { status: 400 }
          );
        }
      }
      await adminDb.collection("users").doc(previousUserId).delete().catch(() => {});
      userId = "";
    }

    await employeeRef.update({
      userId,
      isLogin: isLogin || false,
      name,
      email,
      phone,
      department,
      designation,
      employmentType,
      gender,
      basicSalary: Number(basicSalary) || 0,
      isActive,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      message: "Employee updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update employee." },
      { status: 500 }
    );
  }
}