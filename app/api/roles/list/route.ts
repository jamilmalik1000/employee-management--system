import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("roles").get();

    const roles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(roles);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}