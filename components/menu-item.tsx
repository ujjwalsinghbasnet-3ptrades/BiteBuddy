"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart, type MenuItem } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface MenuItemProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemProps) {
  const { addToCart, setIsOpen } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(item)
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{item.name}</span>
          <span className="text-primary">{formatPrice(item.price)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
