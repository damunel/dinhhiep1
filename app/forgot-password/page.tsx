import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Quên Mật Khẩu - BookStore",
  description: "Đặt lại mật khẩu BookStore của bạn",
}

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      type="forgot-password"
      title="Quên Mật Khẩu"
      description="Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu"
    />
  )
}
