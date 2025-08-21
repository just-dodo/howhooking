import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, isError } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const message = isError 
      ? `❌ Waitlist signup failed for: ${email}`
      : `🎉 New waitlist signup: ${email}`;

    const response = await fetch(
      "https://hooks.slack.com/services/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",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Slack API responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}