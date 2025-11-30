import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Đăng Nhập - BookStore",
  description: "Đăng nhập vào tài khoản BookStore của bạn",
}

export default function LoginPage() {
  return <AuthForm type="login" title="Đăng Nhập" description="Nhập email và mật khẩu của bạn để tiếp tục" />
}
