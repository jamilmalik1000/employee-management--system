import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      basicSalary,
      allowances,
      deductions,
      bonus,
      status,
      paymentDate,
      notes,
    } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Salary record ID is required." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { message: "Status is required." },
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

    const salaryRef = adminDb.collection("salary").doc(id);
    const salaryDoc = await salaryRef.get();

    if (!salaryDoc.exists) {
      return NextResponse.json(
        { message: "Salary record not found." },
        { status: 404 }
      );
    }

    const numericAllowances = Number(allowances) || 0;
    const numericDeductions = Number(deductions) || 0;
    const numericBonus = Number(bonus) || 0;
    const netSalary = numericBasic + numericAllowances + numericBonus - numericDeductions;

    await salaryRef.update({
      basicSalary: numericBasic,
      allowances: numericAllowances,
      deductions: numericDeductions,
      bonus: numericBonus,
      netSalary,
      status,
      paymentDate: paymentDate || "",
      notes: notes?.trim() || "",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Salary record updated successfully." });
  } catch (error) {
    console.error("Update Salary Error:", error);

    return NextResponse.json(
      { message: "Failed to update salary record." },
      { status: 500 }
    );
  }
}
