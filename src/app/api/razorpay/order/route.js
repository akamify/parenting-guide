import { NextResponse } from "next/server";
// Course pages are disabled. Do not expose legacy payment or status writes.
export async function POST() {
  return NextResponse.json({ success: false, message: "Course checkout is not available. Please contact support." }, { status: 410 });
}
