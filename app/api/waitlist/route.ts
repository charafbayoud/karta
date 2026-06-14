import { NextRequest, NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/waitlist";
import { sendWelcomeEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { duplicate, source } = await addToWaitlist(email);

    if (duplicate) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    return NextResponse.json({ success: true, source });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Unable to join the waitlist. Please try again." },
      { status: 500 }
    );
  }
}
