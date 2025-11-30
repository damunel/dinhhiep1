import { type NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    await resetPassword(token, newPassword)

    return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Reset failed" }, { status: 400 })
  }
}
