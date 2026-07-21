import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, category, amount, date, status, notes } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { message: "Expense title is required." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { message: "Category is required." },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number." },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { message: "Date is required." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { message: "Status is required." },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("expenses").add({
      title: title.trim(),
      category,
      amount: numericAmount,
      date,
      status,
      notes: notes?.trim() || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Expense created successfully.", id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Expense Error:", error);

    return NextResponse.json(
      { message: "Failed to create expense." },
      { status: 500 }
    );
  }
}
