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
import MenuItemChat from "./menu-item-chat";
import ChatInput from "./bot/chat-input";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart, setIsOpen: setCartOpen } = useCart();
  const [toolCallId, setToolCallId] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    reload,
  } = useChat({
    maxSteps: 1,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "addToCart") {
        const item = toolCall.args;
        console.log({ onToolCall: toolCall.toolCallId, item });
      }
    },
    async onFinish(message) {
      console.log({ onFinish: message });
      message.parts?.map((part) => {
        if (part.type === "tool-invocation") {
          if (part.toolInvocation.toolName === "addToCart") {
            console.log({ onFinish: part.toolInvocation.toolCallId });
            if (part.toolInvocation.state === "result") {
              const item = part.toolInvocation.result;
              handleCartItem(item);
            }
          }
        }
      });
    },
  });

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

  const handleCartItem = (item: MenuItem) => {
    addToCart(item);
  };

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
                        {message.parts.map((part) => {
                          switch (part.type) {
                            case "text":
                              return part.text;
                            case "tool-invocation": {
                              const callId = part.toolInvocation.toolCallId;
                              const toolName = part.toolInvocation.toolName;
                              switch (toolName) {
                                case "getPopularItems": {
                                  switch (part.toolInvocation.state) {
                                    case "call":
                                      return "Getting popular items...";
                                    case "result":
                                      if (
                                        part.toolInvocation.result.length > 0
                                      ) {
                                        return part.toolInvocation.result.map(
                                          (item: MenuItem) => (
                                            <MenuItemChat
                                              key={item.id}
                                              item={item}
                                            />
                                          )
                                        );
                                      }
                                      return JSON.stringify(
                                        part.toolInvocation.result
                                      );
                                  }
                                }
                                case "addToCart": {
                                  switch (part.toolInvocation.state) {
                                    case "call":
                                      return "Adding item to cart...";
                                    case "result":
                                      const result = part.toolInvocation.result;
                                      return `${result.name} added to cart`;
                                  }
                                }
                              }
                            }
                          }
                        })}
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
              <div className="text-center text-red-500">An error occurred.</div>
              <button type="button" onClick={() => reload()}>
                Retry
              </button>
            </>
          )}
          <CardFooter className="border-t p-3">
            <ChatInput
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              input={input}
              inputRef={inputRef}
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
