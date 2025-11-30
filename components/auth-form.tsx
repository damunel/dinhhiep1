"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface AuthFormProps {
  type: "login" | "signup" | "forgot-password" | "reset-password"
  title: string
  description?: string
  resetToken?: string
}

export function AuthForm({ type, title, description, resetToken }: AuthFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const validateForm = () => {
    if (type === "signup") {
      if (!formData.fullName.trim()) {
        setError("Vui lòng nhập họ tên")
        return false
      }
    }

    if (!formData.email.trim()) {
      setError("Vui lòng nhập email")
      return false
    }

    if (!formData.email.includes("@")) {
      setError("Email không hợp lệ")
      return false
    }

    if (type !== "forgot-password") {
      if (!formData.password) {
        setError("Vui lòng nhập mật khẩu")
        return false
      }

      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự")
        return false
      }
    }

    if (type === "signup" && formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp")
      return false
    }

    if (type === "reset-password" && formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      let endpoint = ""
      let body = {}
      let redirectPath = ""

      if (type === "login") {
        endpoint = "/api/auth/login"
        body = { email: formData.email, password: formData.password }
        redirectPath = "/products"
      } else if (type === "signup") {
        endpoint = "/api/auth/register"
        body = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }
        redirectPath = "/login"
      } else if (type === "forgot-password") {
        endpoint = "/api/auth/forgot-password"
        body = { email: formData.email }
        setSuccess("Kiểm tra email của bạn để lấy hướng dẫn đặt lại mật khẩu!")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
        setLoading(false)
        return
      } else if (type === "reset-password") {
        endpoint = "/api/auth/reset-password"
        body = {
          token: resetToken,
          newPassword: formData.password,
        }
        setSuccess("Mật khẩu đã được đặt lại thành công!")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
        setLoading(false)
        return
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Có lỗi xảy ra")
        return
      }

      if (type === "login") {
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userName", data.user.fullName)
        router.push(redirectPath)
      } else if (type === "signup") {
        setSuccess("Đăng kí thành công! Vui lòng đăng nhập.")
        setTimeout(() => {
          router.push(redirectPath)
        }, 2000)
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "signup" && (
              <div>
                <label className="block text-sm font-medium mb-2">Họ Tên</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  disabled={loading}
                />
              </div>
            )}

            {type !== "reset-password" && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            )}

            {(type === "login" || type === "signup" || type === "reset-password") && (
              <div>
                <label className="block text-sm font-medium mb-2">Mật Khẩu</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            )}

            {(type === "signup" || type === "reset-password") && (
              <div>
                <label className="block text-sm font-medium mb-2">Xác Nhận Mật Khẩu</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-600 text-sm">{success}</div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {loading
                ? "Đang xử lý..."
                : type === "login"
                  ? "Đăng Nhập"
                  : type === "signup"
                    ? "Đăng Kí"
                    : type === "forgot-password"
                      ? "Gửi Hướng Dẫn"
                      : "Đặt Lại Mật Khẩu"}
            </Button>

            {type === "login" && (
              <div className="space-y-2 text-sm text-center">
                <div>
                  Chưa có tài khoản?{" "}
                  <a href="/signup" className="text-blue-600 hover:underline">
                    Đăng kí ngay
                  </a>
                </div>
                <div>
                  <a href="/forgot-password" className="text-blue-600 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
            )}

            {type === "signup" && (
              <div className="text-sm text-center">
                Đã có tài khoản?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Đăng nhập
                </a>
              </div>
            )}

            {(type === "forgot-password" || type === "reset-password") && (
              <div className="text-sm text-center">
                <a href="/login" className="text-blue-600 hover:underline">
                  Quay lại đăng nhập
                </a>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
