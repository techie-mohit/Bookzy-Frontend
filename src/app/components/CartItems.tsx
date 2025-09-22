import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/lib/types/type";
import { Heart, Trash } from "lucide-react";
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
  // console.log("Cart Items:", JSON.stringify(items, null, 2));

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

          <div className="flex-1">
            <h3 className="font-medium">{item.product.title}</h3>
            <div className="mt-1 text-sm text-gray-500">
              Qunatity : {item.quantity}
            </div>
            <div className="mt-1 font-medium">
              <span className="text-gray-500 line-through mr-2">
                 ₹{item.product.price}
              </span>
               ₹{item.product.finalPrice}
            </div>
            <div className = "mt-1 text-sm text-green-500">
              {item.product.shippingCharge === 'free' ? 'Free Shipping' : `Shipping Charge: ₹${item.product.shippingCharge}`}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Button className="w-[100px] md:w-[200px]" variant="outline" size="sm" onClick={() => onRemoveItem(item.product._id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Remove</span>
              </Button>

              <Button
                  onClick={() => onToggleWishlist(item.product._id)}
                  variant="outline"
                  size="sm"
                >
                  <Heart className={`h-4 w-4 mr-1 ${wishlist.some((w)=> w.products.includes(item.product._id)) ? "fill-red-500" : ""}`} />
                  <span className="hidden md:inline">{wishlist.some((w)=> w.products.includes(item.product._id)) ? "Remove From Wishlist" : "Add To Wishlist"}</span>
                </Button>
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

export default CartItems;
