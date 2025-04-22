import { google } from "@ai-sdk/google";
import type { Message } from "ai";
import { streamText } from "ai";
import { prisma } from "@/lib/db";
import { MenuItem } from "@/hooks/use-cart";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

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

  const systemPrompt = `
    You are an AI assistant for a restaurant called "Tasty Bites". Your job is to help customers explore the menu, make decisions, and complete their food orders.
    
    ===========================
    RESTAURANT MENU:
    ${menuItemsFormatted}
    ===========================
    
    AVAILABLE TOOLS:
    1. getPopularItems
       - Description: Returns a list of the most popular menu items.
       - When to call: When the customer asks for recommendations, what's good, or what’s popular.
    
    2. addToCart
       - Description: Adds a specific menu item to the customer's cart.
       - When to call: When the customer expresses intent to order, buy, or add an item to their cart.
       - Input must match exactly with the menu item (name, size, options if applicable).
       - Even if the customer doesn't specify the quantity, you should add 1 item to the cart.
    
    ===========================
    YOUR CAPABILITIES:
    - Recommend menu items based on the customer's preferences.
    - Provide accurate details about ingredients or allergy information based on the menu.
    - Assist customers in adding items to their cart and completing their order.
    
    ===========================
    BEHAVIOR GUIDELINES:
    - Always be friendly, helpful, and conversational.
    - Respond in natural language, but take action using tool calls when appropriate.
    - Never list popular items directly. Instead, call getPopularItems to retrieve them when asked.
    - Never add to cart without clear user intent (e.g., “I want to order”, “Add that to my cart”, “I’ll take the burger”).
    - Do not call getPopularItems unless the user explicitly asks for recommendations or popular items.
    - Do not repeat popular items unless the user asks again.
    - Ensure tool inputs are correct and match the exact menu entries (case-sensitive and options included).
    - Keep your responses concise, informative, and friendly.
    - Use tools only when their usage conditions are met.
    
    ===========================
    EXAMPLES:
    If a customer says: "What do you recommend?" → Call getPopularItems
    If a customer says: "I'd like to order the Chicken Alfredo" → Call addToCart with "Chicken Alfredo"
    If a customer says: "I want burger" → Call addToCart with "burger"
    
    Your primary goal is to provide a seamless and enjoyable ordering experience.
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
