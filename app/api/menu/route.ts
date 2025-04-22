import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        popularity: "desc",
      },
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("Failed to fetch menu items:", error)
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}
