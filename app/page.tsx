import { Header } from "@/components/header";
import { CartSheet } from "@/components/cart-sheet";
import { MenuItemCard } from "@/components/menu-item";
import { ChatBot } from "@/components/chat-bot";
import { prisma } from "@/lib/db";
import { MenuItem } from "@/hooks/use-cart";

export default async function Home() {
  let menuItems: MenuItem[] = [];

  try {
    menuItems = await prisma.menuItem.findMany({
      orderBy: {
        popularity: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8">Our Menu</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item: MenuItem) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </main>
      <CartSheet />
      <ChatBot />
    </div>
  );
}
