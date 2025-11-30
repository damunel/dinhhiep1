import { type NextRequest, NextResponse } from "next/server"
import { requestPasswordReset } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const token = await requestPasswordReset(email)

    // In a real app, you would send an email here
    console.log(`Reset token for ${email}: ${token}`)

    return NextResponse.json(
      { success: true, message: "Check your email for reset instructions", token },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 400 })
  }
}
