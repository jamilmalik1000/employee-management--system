import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      description,
      isActive,
    } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { message: "Department ID is required." },
        { status: 400 }
      );
    }

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "Department name is required." },
        { status: 400 }
      );
    }

    const departmentRef = adminDb.collection("departments").doc(id);

    const departmentDoc = await departmentRef.get();

    if (!departmentDoc.exists) {
      return NextResponse.json(
        { message: "Department not found." },
        { status: 404 }
      );
    }

    // Check duplicate department name (excluding current department)
    const snapshot = await adminDb.collection("departments").get();

    const duplicate = snapshot.docs.find((doc) => {
      if (doc.id === id) return false;

      return (
        doc.data().name?.trim().toLowerCase() ===
        name.trim().toLowerCase()
      );
    });

    if (duplicate) {
      return NextResponse.json(
        {
          message: "Department name already exists.",
        },
        {
          status: 400,
        }
      );
    }

    await departmentRef.update({
      name: name.trim(),
      description: description?.trim() || "",
      isActive: isActive ?? true,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      message: "Department updated successfully.",
    });

  } catch (error) {
    console.error("Update Department Error:", error);

    return NextResponse.json(
      {
        message: "Failed to update department.",
      },
      {
        status: 500,
      }
    );
  }
}