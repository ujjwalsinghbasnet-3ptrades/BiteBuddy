import { google } from "@ai-sdk/google";
import type { Message } from "ai";
import { streamText } from "ai";
import { prisma } from "@/lib/db";
import { MenuItem } from "@/hooks/use-cart";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch menu items to provide context to the AI
  const menuItems = await prisma.menuItem.findMany({
    orderBy: {
      popularity: "desc",
    },
  });

  // Get the most popular items
  const popularItems = menuItems
    .sort((a: MenuItem, b: MenuItem) => b.popularity - a.popularity)
    .slice(0, 3)
    .map((item: MenuItem) => item.name)
    .join(", ");

  // Format menu items for the AI context
  const menuItemsFormatted = menuItems
    .map(
      (item: MenuItem) =>
        `${item.name}: ${item.description} - $${item.price.toFixed(
          2
        )} - Category: ${item.category} - Popularity: ${item.popularity}/100`
    )
    .join("\n");

  // Create a system prompt with instructions and menu information
  const systemPrompt = `
You are an AI assistant for a restaurant called "Tasty Bites". Your job is to help customers with their orders and answer questions about the menu.

RESTAURANT MENU:
${menuItemsFormatted}

POPULAR ITEMS:
The most popular items are: ${popularItems}

CAPABILITIES:
1. You can recommend menu items based on customer preferences
2. You can add items to the customer's cart
3. You can help customers complete their order

INSTRUCTIONS:
- Be friendly, helpful, and conversational
- If a customer wants to order something, you can add it to their cart by including a JSON command in your response
- To add an item to the cart, include this JSON block in your response:
\`\`\`json
{"type": "addToCart", "item": {"id": "item_id", "name": "Item Name", "price": 10.99, "image": "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", "description": "Item description", "category": "Category", "quantity": 1}}
\`\`\`
- To open the cart, include this JSON block:
\`\`\`json
{"type": "openCart"}
\`\`\`
- Make sure the item details match exactly with the menu items
- If a customer asks what's popular or what's good, recommend the most popular items
- If a customer asks about ingredients or allergies, provide accurate information based on the menu descriptions
- Keep your responses concise and helpful

Remember, your JSON commands will be processed by the system but won't be visible to the user.
`;

  try {
    const response = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: messages.map((m: Message) => m.content).join("\n"),
      system: systemPrompt,
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
