import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("employees")
      .orderBy("createdAt", "desc")
      .get();

    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch employees." },
      { status: 500 }
    );
  }
}