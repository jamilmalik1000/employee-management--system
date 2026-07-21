import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const SETTINGS_DOC = adminDb.collection("settings").doc("company");

const DEFAULTS = {
  companyName: "",
  address: "",
  email: "",
  phone: "",
  currency: "USD",
  timezone: "",
};

export async function GET() {
  try {
    const doc = await SETTINGS_DOC.get();

    return NextResponse.json(
      doc.exists ? { ...DEFAULTS, ...doc.data() } : DEFAULTS,
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Settings Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, address, email, phone, currency, timezone } = body;

    if (!companyName || !companyName.trim()) {
      return NextResponse.json(
        { message: "Company name is required." },
        { status: 400 }
      );
    }

    await SETTINGS_DOC.set(
      {
        companyName: companyName.trim(),
        address: address?.trim() || "",
        email: email?.trim() || "",
        phone: phone?.trim() || "",
        currency: currency || "USD",
        timezone: timezone?.trim() || "",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ message: "Settings saved successfully." });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return NextResponse.json(
      { message: "Failed to save settings." },
      { status: 500 }
    );
  }
}
