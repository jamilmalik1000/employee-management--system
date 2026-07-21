import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      employeeId,
      employeeName,
      month,
      basicSalary,
      allowances,
      deductions,
      bonus,
      status,
      paymentDate,
      notes,
    } = body;

    if (!employeeId || !employeeName || !month || !status) {
      return NextResponse.json(
        { message: "Employee, month and status are required." },
        { status: 400 }
      );
    }

    const numericBasic = Number(basicSalary) || 0;
    if (numericBasic <= 0) {
      return NextResponse.json(
        { message: "Basic salary must be a positive number." },
        { status: 400 }
      );
    }

    // Prevent duplicate salary entries for the same employee in the same month
    const existing = await adminDb
      .collection("salary")
      .where("employeeId", "==", employeeId)
      .where("month", "==", month)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { message: "A salary record for this employee already exists for this month." },
        { status: 400 }
      );
    }

    const numericAllowances = Number(allowances) || 0;
    const numericDeductions = Number(deductions) || 0;
    const numericBonus = Number(bonus) || 0;
    const netSalary = numericBasic + numericAllowances + numericBonus - numericDeductions;

    const docRef = await adminDb.collection("salary").add({
      employeeId,
      employeeName,
      month,
      basicSalary: numericBasic,
      allowances: numericAllowances,
      deductions: numericDeductions,
      bonus: numericBonus,
      netSalary,
      status,
      paymentDate: paymentDate || "",
      notes: notes?.trim() || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Salary record added successfully.", id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Salary Error:", error);

    return NextResponse.json(
      { message: "Failed to add salary record." },
      { status: 500 }
    );
  }
}
