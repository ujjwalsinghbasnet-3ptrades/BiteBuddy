import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { name: string } }) {
  try {
    const name = params.name

    if (!name) {
      return NextResponse.json({ error: "Menu item name is required" }, { status: 400 })
    }

    // Find menu items that match the name (case insensitive)
    const menuItems = await prisma.menuItem.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    })

    if (!menuItems.length) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(menuItems[0])
  } catch (error) {
    console.error("Failed to fetch menu item:", error)
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 })
  }
}
