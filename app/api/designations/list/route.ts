import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("designations").get();
    const designations = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          name: String(data.name || ""),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(designations);
  } catch (error) {
    console.error("List designations error:", error);
    return NextResponse.json(
      { message: "Failed to fetch designations." },
      { status: 500 }
    );
  }
}
