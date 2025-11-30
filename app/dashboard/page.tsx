"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Order {
  id: string
  userId: string
  items: Array<{ productId: string; quantity: number; price: number }>
  total: number
  status: "pending" | "completed" | "cancelled"
  createdAt: Date
}

interface UserProfile {
  id: string
  email: string
  fullName: string
  createdAt: Date
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile")

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")

    if (!userId) {
      router.push("/login")
      return
    }

    // Load user profile and orders
    loadUserData(userId, userName)
  }, [router])

  const loadUserData = (userId: string, userName: string | null) => {
    // Mock user data
    const mockUser: UserProfile = {
      id: userId,
      email: localStorage.getItem("userEmail") || "user@example.com",
      fullName: userName || "User",
      createdAt: new Date(),
    }

    setUser(mockUser)

    // Load orders from database (mock)
    const allOrders = Array.from(
      new Map<string, Order>([
        [
          "1",
          {
            id: "1",
            userId,
            items: [{ productId: "1", quantity: 2, price: 12.99 }],
            total: 25.98,
            status: "completed" as const,
            createdAt: new Date("2024-01-15"),
          },
        ],
      ]).values(),
    )

    setOrders(allOrders)
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("cart")
    router.push("/")
  }

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/products">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">BookStore</h1>
          </Link>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 px-4 py-2">
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* User Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Tài Khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tên</p>
                <p className="font-semibold">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-sm">{user.email}</p>
              </div>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveTab("profile")}>
                Cập Nhật Thông Tin
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Tổng Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Đã Hoàn Thành</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Tổng Chi Tiêu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Hồ Sơ
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Lịch Sử Mua Hàng
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Tài Khoản</CardTitle>
              <CardDescription>Quản lý thông tin hồ sơ của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Họ Tên</label>
                <input
                  type="text"
                  value={user.fullName}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ngày Tạo Tài Khoản</label>
                <input
                  type="text"
                  value={user.createdAt.toLocaleDateString("vi-VN")}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <Link href="/forgot-password">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Đổi Mật Khẩu</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <p className="mb-4">Bạn chưa có đơn hàng nào</p>
                  <Link href="/products">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Bắt Đầu Mua Sắm</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Đơn Hàng #{order.id}</CardTitle>
                        <CardDescription>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</CardDescription>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status === "completed"
                          ? "Hoàn Thành"
                          : order.status === "pending"
                            ? "Đang Xử Lý"
                            : "Hủy"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            Sản phẩm #{item.productId} x{item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold">
                      <span>Tổng:</span>
                      <span className="text-blue-600">${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
