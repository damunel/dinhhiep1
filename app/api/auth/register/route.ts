import { type NextRequest, NextResponse } from "next/server"
import { register } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await register(email, password, fullName)

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 })
  }
}
