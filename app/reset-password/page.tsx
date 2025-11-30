"use client"

import { useSearchParams } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  return (
    <AuthForm
      type="reset-password"
      title="Đặt Lại Mật Khẩu"
      description="Nhập mật khẩu mới của bạn"
      resetToken={token}
    />
  )
}
