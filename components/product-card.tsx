"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductCardProps {
  id: string
  title: string
  author: string
  price: number
  image: string
  stock: number
  description: string
  onAddToCart: (productId: string, quantity: number) => void
}

export function ProductCard({ id, title, author, price, image, stock, description, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart(id, quantity)
    setQuantity(1)
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 bg-gray-200">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardHeader className="flex-1">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <CardDescription>{author}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${price}</span>
          <span className="text-sm text-gray-500">{stock > 0 ? `${stock} sản phẩm` : "Hết hàng"}</span>
        </div>
      </CardContent>
      <CardFooter className="space-y-2">
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={stock === 0}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <span className="flex-1 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={stock === 0}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {stock > 0 ? "Thêm vào Giỏ" : "Hết Hàng"}
        </Button>
      </CardFooter>
    </Card>
  )
}
