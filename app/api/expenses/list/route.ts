import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("expenses")
      .orderBy("date", "desc")
      .get();

    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("List Expenses Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch expenses." },
      { status: 500 }
    );
  }
}
