import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Expense ID is required." },
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

    await expenseRef.delete();

    return NextResponse.json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    return NextResponse.json(
      { message: "Failed to delete expense." },
      { status: 500 }
    );
  }
}
