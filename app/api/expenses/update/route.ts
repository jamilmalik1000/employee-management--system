import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, title, category, amount, date, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Expense ID is required." },
        { status: 400 }
      );
    }

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

    const expenseRef = adminDb.collection("expenses").doc(id);
    const expenseDoc = await expenseRef.get();

    if (!expenseDoc.exists) {
      return NextResponse.json(
        { message: "Expense not found." },
        { status: 404 }
      );
    }

    await expenseRef.update({
      title: title.trim(),
      category,
      amount: numericAmount,
      date,
      status,
      notes: notes?.trim() || "",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Expense updated successfully." });
  } catch (error) {
    console.error("Update Expense Error:", error);

    return NextResponse.json(
      { message: "Failed to update expense." },
      { status: 500 }
    );
  }
}
