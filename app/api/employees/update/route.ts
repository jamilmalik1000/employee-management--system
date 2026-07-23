import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function errorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : "";
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      isLogin,
      password,
      profilePhotoUrl,
      name,
      cnic,
      email,
      phone,
      address,
      department,
      designation,
      qualification,
      joiningDate,
      employmentType,
      gender,
      basicSalary,
      bankDetails,
      documents,
      emergencyContact,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Employee ID is required." },
        { status: 400 }
      );
    }

    if (
      !name ||
      !email ||
      !phone ||
      !cnic ||
      !department ||
      !designation ||
      !employmentType
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
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

    const cnicSnap = await adminDb
      .collection("employees")
      .where("cnic", "==", String(cnic).trim())
      .get();

    if (cnicSnap.docs.some((doc) => doc.id !== id)) {
      return NextResponse.json(
        { message: "CNIC already exists." },
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
      } catch (err: unknown) {
        return NextResponse.json(
          { message: errorMessage(err, "Failed to update login account.") },
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
      } catch (err: unknown) {
        return NextResponse.json(
          { message: errorMessage(err, "Failed to create login account.") },
          { status: 400 }
        );
      }
    } else if (!isLogin && previousUserId) {
      // Revoking login entirely
      try {
        await adminAuth.deleteUser(previousUserId);
      } catch (err: unknown) {
        if (errorCode(err) !== "auth/user-not-found") {
          return NextResponse.json(
            { message: errorMessage(err, "Failed to remove login account.") },
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
      profilePhotoUrl: String(profilePhotoUrl || "").trim(),
      name,
      cnic: String(cnic || "").trim(),
      email,
      phone,
      address: String(address || "").trim(),
      department,
      designation,
      qualification: String(qualification || "").trim(),
      joiningDate: String(joiningDate || ""),
      employmentType,
      gender: String(gender || ""),
      basicSalary: Number(basicSalary) || 0,
      bankDetails: {
        bankName: String(bankDetails?.bankName || "").trim(),
        accountTitle: String(bankDetails?.accountTitle || "").trim(),
        accountNumber: String(bankDetails?.accountNumber || "").trim(),
        iban: String(bankDetails?.iban || "").trim(),
      },
      documents: Array.isArray(documents)
        ? documents
            .map((document) => ({
              name: String(document?.name || "").trim(),
              url: String(document?.url || "").trim(),
            }))
            .filter((document) => document.name || document.url)
        : [],
      emergencyContact: {
        name: String(emergencyContact?.name || "").trim(),
        relationship: String(emergencyContact?.relationship || "").trim(),
        phone: String(emergencyContact?.phone || "").trim(),
      },
      isActive: isActive ?? true,
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
