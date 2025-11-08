import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Testing Resend email...")
    console.log("API Key exists:", !!process.env.RESEND_API_KEY)
    console.log("API Key starts with:", process.env.RESEND_API_KEY?.substring(0, 10))

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "orders@lisajtphotography.com",
        to: ["LisaJTPhotography@gmail.com"],
        subject: "Test Email from Lisa JT Photography - " + new Date().toISOString(),
        html: `
          <h1>Test Email</h1>
          <p>This is a test email sent at ${new Date().toLocaleString()}</p>
          <p>If you receive this, your custom domain email is working! 🎉</p>
        `,
        text: `Test email sent at ${new Date().toLocaleString()}. If you receive this, your custom domain email is working!`,
      }),
    })

    const result = await response.json()

    console.log("Response status:", response.status)
    console.log("Response:", result)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result,
          status: response.status,
          message: "Email API call failed",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully from custom domain!",
      emailId: result.id,
      result,
      note: "Check your email at LisaJTPhotography@gmail.com (including spam folder)",
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
