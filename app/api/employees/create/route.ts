import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

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
      userId,
      isLogin,
      name,
      email,
      phone,
      department,
      designation,
      employmentType,
      gender,
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

    const docRef = await adminDb.collection("employees").add({
      employeeId,

      userId: userId || "",

      isLogin: isLogin || false,

      name,

      email,

      phone,

      department,

      designation,

      employmentType,

      gender,

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