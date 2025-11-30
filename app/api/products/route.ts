import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const products = Array.from(db.products.values())
  return NextResponse.json(products)
}
