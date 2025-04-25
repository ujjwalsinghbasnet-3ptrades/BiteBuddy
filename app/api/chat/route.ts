import { google } from "@ai-sdk/google";
import type { Message } from "ai";
import { streamText } from "ai";
import { prisma } from "@/lib/db";
import { MenuItem, CartItem } from "@/hooks/use-cart";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages, cart } = await req.json();

  // Fetch menu items to provide context to the AI
  const menuItems = await prisma.menuItem.findMany({
    orderBy: {
      popularity: "desc",
    },
  });

  // Format menu items for the AI context
  const menuItemsFormatted = menuItems
    .map(
      (item: MenuItem) =>
        `${item.name}: ${item.description} - $${item.price.toFixed(
          2
        )} - Category: ${item.category} - Popularity: ${item.popularity}/100`
    )
    .join("\n");

  // Format current cart items for the AI context
  const cartItemsFormatted = cart
    ? cart
        .map((item: CartItem) => `\n${item.name} (Quantity: ${item.quantity})`)
        .join("\n")
    : "Cart is empty";

  const systemPrompt = `
    You are an AI assistant for a restaurant called "Tasty Bites". Your job is to help customers explore the menu, make decisions, and complete their food orders.
    
    ===========================
    RESTAURANT MENU:
    ${menuItemsFormatted}
    ===========================
    
    CURRENT CART:
    ${cartItemsFormatted}
    ===========================
    
    AVAILABLE TOOLS:
    
    1. getPopularItems
       - Description: Returns a list of the most popular menu items.
       - When to call: Only when the customer asks for recommendations, what's good, or what's popular.
    
    2. addToCart
       - Description: Adds a specific menu item to the customer's cart.
       - When to call: When the customer clearly expresses intent to order, buy, or add an item to their cart.
       - Input may be a partial match; confirm with the customer if multiple similar items exist.
       - Default quantity is 1 unless specified.
       - If an item is already in the cart, ask if the customer wants to add more.
       - Add only the item mentioned in the current user message — never re-add previously added items.
       - Do not call getPopularItems in the same turn where addToCart is required.
       - Do not call addToCart when the customer is only exploring or asking questions.
    
    ===========================
    YOUR CAPABILITIES:
    
    - Recommend menu items based on customer preferences.
    - Provide details about ingredients, dietary info, or allergy concerns.
    - Assist customers in building and completing their food orders.
    
    ===========================
    BEHAVIOR GUIDELINES:
    
    - Be friendly, helpful, and conversational.
    - Respond naturally, but take action using tool calls when appropriate.
    - Never list popular items directly — always use getPopularItems when asked.
    - Only call addToCart when the user shows clear intent to order.
    - Only respond to the item mentioned in the current user message — do not repeat or reconfirm previously added items.
    - Ensure tool inputs exactly match menu entries (case-sensitive, include any options).
    - Keep responses concise, polite, and clear.
    - Use tools strictly according to their usage rules.
    - Check the CURRENT CART section before adding items to avoid duplicates.
    - When adding items, only add the specific item mentioned in the current message.
    
    ===========================
    EXAMPLES:
    
    User: "What do you recommend?"  
    → Call getPopularItems
    
    User: "I'd like to order the Chicken Alfredo"  
    → Call addToCart with "Chicken Alfredo"
    
    User: "I want a burger"  
    → Call addToCart with "burger"
    
    User: "I want another burger"  
    → Call addToCart with "burger"
    
    User: "I want to order the Chicken Alfredo too"  
    → Call addToCart with "Chicken Alfredo" (DO NOT re-add any previously ordered items)
    
    User: "want veg wrap too"  
    → Call addToCart with "Veggie Wrap" only
    
    ===========================
    REMINDER:
    
    Your primary goal is to provide a seamless and enjoyable ordering experience. Guide the customer, respect their intent, and ensure their order is processed smoothly and accurately.
    `;

  try {
    const response = streamText({
      model: google("gemini-1.5-flash"),
      prompt: messages.map((m: Message) => m.content).join("\n"),
      system: systemPrompt,
      tools: {
        getPopularItems: {
          description: "list down the most popular items",
          parameters: z.object({
            count: z.number().optional().default(3),
          }),
          execute: async ({ count }) => {
            const items = await prisma.menuItem.findMany({
              orderBy: {
                popularity: "desc",
              },
              take: count,
            });
            return items as MenuItem[];
          },
        },
        addToCart: {
          description: "add an item to the customer's cart",
          parameters: z.object({
            itemName: z.string(),
            quantity: z.number().optional().default(1),
          }),
          execute: async ({ itemName, quantity }) => {
            const item = await prisma.menuItem.findFirst({
              where: {
                name: itemName,
              },
            });
            if (!item) {
              throw new Error("Item not found");
            }
            return item;
          },
        },
      },
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(
      "Sorry, I'm having trouble connecting to the AI service. Please try again later.",
      {
        status: 500,
      }
    );
  }
}
