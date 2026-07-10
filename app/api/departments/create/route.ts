import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      isActive,
    } = body;

    // Validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        {
          message: "Department name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const departmentName = name.trim();

    // Check duplicate department name (case-insensitive)
    const snapshot = await adminDb.collection("departments").get();

    const exists = snapshot.docs.some(
      (doc) =>
        doc.data().name?.trim().toLowerCase() ===
        departmentName.toLowerCase()
    );

    if (exists) {
      return NextResponse.json(
        {
          message: "Department already exists.",
        },
        {
          status: 400,
        }
      );
    }

    // Create department
    const docRef = await adminDb.collection("departments").add({
      name: departmentName,
      description: description?.trim() || "",
      isActive: isActive ?? true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        message: "Department created successfully.",
        id: docRef.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create Department Error:", error);

    return NextResponse.json(
      {
        message: "Failed to create department.",
      },
      {
        status: 500,
      }
    );
  }
}