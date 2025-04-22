"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send } from "lucide-react";
import { useCart, type MenuItem } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart, setIsOpen: setCartOpen } = useCart();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    reload,
  } = useChat({});

  console.log({ error, messages });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Parse JSON commands from the AI
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        try {
          // Look for JSON commands in the message
          const jsonRegex = /```json\n([\s\S]*?)\n```/g;
          let match;
          while ((match = jsonRegex.exec(lastMessage.content)) !== null) {
            const jsonContent = match[1];
            const command = JSON.parse(jsonContent);

            // Handle different command types
            if (command.type === "addToCart" && command.item) {
              addToCart(command.item as MenuItem);
            } else if (command.type === "openCart") {
              setCartOpen(true);
            }
          }
        } catch (e) {
          console.error("Failed to parse JSON command:", e);
        }
      }
    }
  }, [messages, addToCart, setCartOpen]);

  return (
    <>
      {/* Chat toggle button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-20 right-4 w-80 sm:w-96 transition-all duration-300 transform",
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <Card className="shadow-xl border-primary/10">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Restaurant Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                  <MessageCircle className="h-8 w-8 mb-2 opacity-50" />
                  <p>Hi there! I'm your restaurant assistant.</p>
                  <p className="text-sm mt-1">
                    Ask me about our menu or place an order!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 max-w-[80%] text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {/* Replace JSON blocks with nothing in the displayed message */}
                        {message.content.replace(/```json\n[\s\S]*?\n```/g, "")}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              {status === "streaming" && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3 py-2 max-w-[80%] text-sm bg-muted">
                    <div className="flex space-x-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          {error && (
            <>
              <div>An error occurred.</div>
              <button type="button" onClick={() => reload()}>
                Retry
              </button>
            </>
          )}
          <CardFooter className="border-t p-3">
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center space-x-2"
            >
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={status === "streaming" || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
