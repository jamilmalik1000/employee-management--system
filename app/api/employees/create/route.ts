import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getErrorMessage } from "@/lib/errors";

function generateEmployeeId() {
  return (
    "EMP-" +
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
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

    if (
      !name ||
      !email ||
      !phone ||
      !department ||
      !designation ||
      !employmentType ||
      !gender
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    // Duplicate Email
    const emailSnap = await adminDb
      .collection("employees")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!emailSnap.empty) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    // Duplicate Phone
    const phoneSnap = await adminDb
      .collection("employees")
      .where("phone", "==", phone)
      .limit(1)
      .get();

    if (!phoneSnap.empty) {
      return NextResponse.json(
        { message: "Phone number already exists." },
        { status: 400 }
      );
    }

    // Generate Employee ID
    let employeeId = generateEmployeeId();

    while (true) {
      const employeeSnap = await adminDb
        .collection("employees")
        .where("employeeId", "==", employeeId)
        .limit(1)
        .get();

      if (employeeSnap.empty) break;

      employeeId = generateEmployeeId();
    }

    // Set up a real login account when requested
    let userId = "";

    if (isLogin) {
      if (!password || password.length < 6) {
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
          password,
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
          { message: getErrorMessage(err, "Failed to create login account.") },
          { status: 400 }
        );
      }
    }

    const docRef = await adminDb.collection("employees").add({
      employeeId,

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

      createdAt: Timestamp.now(),

      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      message: "Employee created successfully.",
      id: docRef.id,
      employeeId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create employee." },
      { status: 500 }
    );
  }
}
