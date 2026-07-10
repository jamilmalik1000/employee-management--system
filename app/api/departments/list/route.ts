import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("departments")
      .orderBy("createdAt", "desc")
      .get();

    const departments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(departments, {
      status: 200,
    });

  } catch (error) {
    console.error("List Departments Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch departments.",
      },
      {
        status: 500,
      }
    );
  }
}