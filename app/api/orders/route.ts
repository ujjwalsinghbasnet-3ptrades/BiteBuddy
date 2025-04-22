import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, total, address, paymentMethod } = body

    const order = await prisma.order.create({
      data: {
        items,
        total,
        address,
        paymentMethod,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
