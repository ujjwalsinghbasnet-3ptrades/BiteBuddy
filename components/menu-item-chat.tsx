import React from "react";
import { MenuItem } from "@/hooks/use-cart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

const MenuItemChat = ({ item }: { item: MenuItem }) => {
  return (
    <div className="h-32 w-full flex gap-2 mb-2 rounded-md border border-gray-600 overflow-hidden">
      <div className="flex-1 relative h-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {item.description}
        </CardDescription>
      </div>
    </div>
  );
};

export default MenuItemChat;
