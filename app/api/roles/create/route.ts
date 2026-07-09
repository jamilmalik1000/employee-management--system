import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const roleRef = await adminDb.collection("roles").add({
      name: body.name,
      description: body.description,
      permissions: body.permissions,
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