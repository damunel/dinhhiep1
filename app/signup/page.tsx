import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Đăng Kí - BookStore",
  description: "Tạo tài khoản BookStore mới",
}

export default function SignupPage() {
  return <AuthForm type="signup" title="Đăng Kí Tài Khoản" description="Tạo tài khoản để mua sắm sách online" />
}
