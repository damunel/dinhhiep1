import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { userId, items } = await request.json()

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let total = 0
    const orderItems = []

    for (const item of items) {
      const product = db.products.get(item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${product.title}` }, { status: 400 })
      }

      const itemTotal = product.price * item.quantity
      total += itemTotal
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      })

      // Update stock
      product.stock -= item.quantity
    }

    const orderId = crypto.randomUUID()
    const order = {
      id: orderId,
      userId,
      items: orderItems,
      total,
      status: "completed" as const,
      createdAt: new Date(),
    }

    db.orders.set(orderId, order)
    db.carts.delete(userId) // Clear cart after order

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order creation failed" },
      { status: 400 },
    )
  }
}
