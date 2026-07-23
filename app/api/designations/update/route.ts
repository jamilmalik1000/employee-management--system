import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!id || !name) {
      return NextResponse.json(
        { message: "Designation and name are required." },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("designations").doc(id);
    const current = await ref.get();
    if (!current.exists) {
      return NextResponse.json(
        { message: "Designation not found." },
        { status: 404 }
      );
    }

    const duplicates = await adminDb
      .collection("designations")
      .where("name", "==", name)
      .get();
    if (duplicates.docs.some((doc) => doc.id !== id)) {
      return NextResponse.json(
        { message: "This designation already exists." },
        { status: 409 }
      );
    }

    const previousName = String(current.data()?.name || "");
    await ref.update({
      name,
      description,
      isActive: body.isActive ?? true,
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (previousName && previousName !== name) {
      const employees = await adminDb
        .collection("employees")
        .where("designation", "==", previousName)
        .get();

      for (let start = 0; start < employees.docs.length; start += 450) {
        const batch = adminDb.batch();
        employees.docs.slice(start, start + 450).forEach((employee) => {
          batch.update(employee.ref, {
            designation: name,
            updatedAt: FieldValue.serverTimestamp(),
          });
        });
        await batch.commit();
      }
    }

    return NextResponse.json({
      message: "Designation updated successfully.",
    });
  } catch (error) {
    console.error("Update designation error:", error);
    return NextResponse.json(
      { message: "Failed to update designation." },
      { status: 500 }
    );
  }
}
