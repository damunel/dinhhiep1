"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface CartItem {
  productId: string
  title: string
  author: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    cardNumber: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }

    const savedCart = localStorage.getItem("cart")
    if (!savedCart) {
      router.push("/products")
      return
    }

    setCart(JSON.parse(savedCart))
  }, [router])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        setError("Vui lòng điền đầy đủ thông tin")
        setLoading(false)
        return
      }

      const userId = localStorage.getItem("userId")

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Thanh toán thất bại")
        return
      }

      setSuccess(true)
      localStorage.removeItem("cart")

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle>Giỏ hàng trống</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">Quay lại mua sắm</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-blue-600">x{item.quantity}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.author}</p>
                    <div className="flex justify-between text-sm">
                      <span>${item.price}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>Tổng:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Giao Hàng & Thanh Toán</CardTitle>
                <CardDescription>Nhập thông tin để hoàn tất đơn hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Số Điện Thoại</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0123456789"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Địa Chỉ Giao Hàng</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Đường ABC, TP HCM"
                      disabled={loading}
                    />
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Demo: Sử dụng số thẻ <strong>4111 1111 1111 1111</strong> để test
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số Thẻ Tín Dụng</label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="4111 1111 1111 1111"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-600 text-sm">
                      Thanh toán thành công! Chuyển hướng đến dashboard...
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? "Đang xử lý..." : `Thanh Toán ${total.toFixed(2)} USD`}
                  </Button>

                  <Link href="/products">
                    <Button variant="outline" className="w-full bg-transparent" disabled={loading}>
                      Quay Lại
                    </Button>
                  </Link>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
