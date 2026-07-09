import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, name, description, Permissions } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Role ID is required." },
        { status: 400 }
      );
    }

    await adminDb.collection("roles").doc(id).update({
      name,
      description,
      Permissions,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Role updated successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update role." },
      { status: 500 }
    );
  }
}