"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { ShoppingCart } from "@/components/shopping-cart"

interface Product {
  id: string
  title: string
  author: string
  price: number
  image: string
  stock: number
  description: string
}

interface CartItem {
  productId: string
  title: string
  author: string
  price: number
  quantity: number
}

export function ProductsClientPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }
    setIsAuthenticated(true)

    // Load products
    fetchProducts()

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId)

      let newCart
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        newCart = [
          ...prevCart,
          {
            productId,
            title: product.title,
            author: product.author,
            price: product.price,
            quantity,
          },
        ]
      }

      localStorage.setItem("cart", JSON.stringify(newCart))
      return newCart
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      localStorage.setItem("cart", JSON.stringify(newCart))
      return newCart
    })
  }

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.productId !== productId)
      localStorage.setItem("cart", JSON.stringify(newCart))
      return newCart
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/products">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">BookStore</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative p-2 hover:bg-gray-100 rounded-lg">
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("userId")
                localStorage.removeItem("userName")
                localStorage.removeItem("cart")
                router.push("/")
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">Đang tải sản phẩm...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Không tìm thấy sản phẩm</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  )
}
