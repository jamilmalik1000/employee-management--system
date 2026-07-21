import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    const snapshot = userId
      ? await adminDb.collection("employees").where("userId", "==", userId).get()
      : await adminDb.collection("employees").orderBy("createdAt", "desc").get();

    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch employees." },
      { status: 500 }
    );
  }
}