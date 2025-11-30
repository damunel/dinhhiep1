"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CartItem {
  productId: string
  title: string
  author: string
  price: number
  quantity: number
}

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export function ShoppingCart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-end">
      <Card className="w-full md:w-96 rounded-none md:rounded-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Giỏ Hàng</CardTitle>
            <CardDescription>{items.length} sản phẩm</CardDescription>
          </div>
          <button onClick={onClose} className="text-2xl leading-none hover:text-gray-600">
            ×
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Giỏ hàng trống</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.author}</p>
                    <p className="text-blue-600 font-semibold">${item.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Thanh Toán</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
