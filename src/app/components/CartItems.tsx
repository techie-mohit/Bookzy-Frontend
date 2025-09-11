import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/lib/types/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CartItemsProp {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: { products: string[] }[];
}

const CartItems: React.FC<CartItemsProp> = ({
  items,
  onRemoveItem,
  onToggleWishlist,
  wishlist,
}) => {
  console.log("Cart Items:", JSON.stringify(items, null, 2));

  return (
    <ScrollArea className="h-[400px] px-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex flex-col md:flex-row gap-4 py-4 border-b last:border-0"
        >
          <Link href={`/books/${item.product._id}`}>
            <Image
              src={item?.product?.images?.[0]}
              alt={item?.product?.title}
              width={80}
              height={100}
              className="object-contain w-60 md:48 rounded-xl"
            />
          </Link>
        </div>
      ))}
    </ScrollArea>
  );
};

export default CartItems;
