import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "BookStore - Your Online Library",
  description: "Buy books online with secure authentication",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-blue-200 bg-white">
        <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">BookStore</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Đăng Nhập</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Đăng Kí</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Khám Phá Thế Giới Sách Trực Tuyến</h2>
            <p className="text-xl text-gray-600">
              Truy cập hàng triệu cuốn sách từ các tác giả nổi tiếng trên toàn thế giới. Mua sắm, đọc và khám phá những
              tác phẩm tuyệt vời.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Khám Phá Sách
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Bắt Đầu Ngay
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Đăng Kí Tài Khoản</h3>
                  <p className="text-sm text-gray-600">Tạo tài khoản của bạn trong 2 phút</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tìm Kiếm Sách</h3>
                  <p className="text-sm text-gray-600">Tìm kiếm từ hàng ngàn cuốn sách</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Thanh Toán An Toàn</h3>
                  <p className="text-sm text-gray-600">Giao dịch được bảo vệ 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
