import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const existing = await adminDb.collection("roles")
      .where("name", "==", body.name.trim())
      .get();

    // Case-insensitive duplicate check
    const duplicate = existing.empty
      ? (await adminDb.collection("roles").get()).docs.find(
          (d) => (d.data().name as string)?.toLowerCase() === body.name.trim().toLowerCase()
        )
      : existing.docs[0];

    if (duplicate) {
      return NextResponse.json(
        { message: `A role named "${body.name.trim()}" already exists.` },
        { status: 409 }
      );
    }

    const roleRef = await adminDb.collection("roles").add({
      name: body.name,
      description: body.description,
      Permissions: body.Permissions,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Role created successfully",
      id: roleRef.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create role" },
      { status: 500 }
    );
  }
}