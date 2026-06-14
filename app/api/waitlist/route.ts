import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";
import { addToWaitlist } from "@/lib/waitlist";
import { sendWelcomeEmail } from "@/lib/resend";

function getOriginFromRequest(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${proto}://${host.split(",")[0].trim()}`.replace(/\/$/, "");
  }

  return getAppUrl();
}

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
      await sendWelcomeEmail(email, getOriginFromRequest(request));
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
