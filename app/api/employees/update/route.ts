import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
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

    await employeeRef.update({
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