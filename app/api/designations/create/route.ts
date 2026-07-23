import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!name) {
      return NextResponse.json(
        { message: "Designation name is required." },
        { status: 400 }
      );
    }

    const existing = await adminDb
      .collection("designations")
      .where("name", "==", name)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { message: "This designation already exists." },
        { status: 409 }
      );
    }

    const ref = await adminDb.collection("designations").add({
      name,
      description,
      isActive: body.isActive ?? true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Designation created successfully.", id: ref.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create designation error:", error);
    return NextResponse.json(
      { message: "Failed to create designation." },
      { status: 500 }
    );
  }
}
