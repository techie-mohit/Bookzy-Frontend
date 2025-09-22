"use client";

import CartItems from "@/app/components/CartItems";
import NoData from "@/app/components/NoData";
import PriceDetails from "@/app/components/PriceDetails";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Address } from "@/lib/types/type";
import {
  useAddToWishlistMutation,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useGetCartQuery,
  useGetOrderByIdQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { setCart } from "@/store/slice/cartSlice";
import { setCheckoutStep, setOrderId } from "@/store/slice/checkoutSlice";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { set } from "date-fns";
import { ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CheckoutAddress from "@/app/components/CheckoutAddress";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { orderId, step } = useSelector((state: RootState) => state.checkout);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(
    user?._id
  );
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(
    orderId || { skip: !orderId }
  );
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (orderData && orderData.shippingAddress) {
      setSelectedAddress(orderData.shippingAddress);
    }
  }, [orderData]);

  useEffect(() => {
    if (step === "address" && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step, selectedAddress]);

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data)); // this will store cart with populated items
    }
  }, [cartData, dispatch]);

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeCartMutation(productId).unwrap();
      if (result.success) {
        dispatch(setCart(result.data));
        toast.success(result.message || "Item removed from cart");
      }
    } catch (error) {
      console.log("Remove from cart error", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleAddToWhishlist = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId)
      );

      if (isWishlist) {
        const result = await removeWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishlist(productId));
          toast.success(result.message || "Removed from wishlist");
        } else {
          throw new Error(result.message || "Failed to remove from wishlist");
        }
      } else {
        const result = await addToWishlistMutation(productId).unwrap();
        if (result.success && result.data) {
          dispatch(addToWishlist(result.data));
          toast.success(result.message || "Added to wishlist successfully");
        } else {
          throw new Error(result.message || "Failed to add to wishlist");
        }
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage || "Failed to add/remove to wishlist");
    }
  };

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your cart is empty."
        description="Looks like you haven't added any items yet. 
            Explore our collection and find something you love!"
        buttonText="Browse Books"
        imageUrl="/images/cart.webp"
        onClick={() => router.push("/books")}
      />
    );
  }

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.finalPrice * item.quantity,
    0
  );
  const totalOriginalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalDiscount = totalOriginalAmount - totalAmount;

  const shippingCharge = cart.items.map((item) =>
    item.product.shippingCharge.toLowerCase() === "free"
      ? 0
      : parseFloat(item.product.shippingCharge)
  );
  const maximumShippingCharge = Math.max(...shippingCharge, 0);
  const finalAmount = totalAmount + maximumShippingCharge;

  const handleProceedToCheckout = async () => {
    if (step === "cart") {
      try {
        const result = await createOrUpdateOrder({
          orderData: { items: cart.items, totalAmount: totalAmount },
        }).unwrap();
        console.log("Order Creation Result:", result);
        if (result.success && result.data?._id) {
          toast.success("Order Created Successfully");
          dispatch(setOrderId(result.data._id));
          dispatch(setCheckoutStep("address"));
        } else {
          throw new Error(result.message || "Failed to create order");
        }
      } catch (error) {
        toast.error("Failed to create order. Please try again.");
        console.log(error);
      }
    } else if (step === "address") {
      if (selectedAddress) {
        dispatch(setCheckoutStep("payment"));
      } else {
        setShowAddressDialog(true);
      }
    } else if (step === "payment") {
      handlePayment();
    }
  };

  const handleSelectedAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);

    if (orderId) {
      try {
        await createOrUpdateOrder({
          orderId,
          orderData: { shippingAddress: address },
        }).unwrap();

        toast.success("Shipping address updated successfully");
      } catch (error) {
        console.log("Failed to update shipping address to order", error);
        toast.error("Failed to update shipping address to order");
      }
    }
  };

  const handlePayment = async () => {};

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="bg-gray-100 py-4 px-6 mb-8">
          <div className="container mx-auto flex items-center">
            <ShoppingCart className="h-6 w-6 text-gray-600 mr-2" />
            <span className="text-lg font-semibold text-gray-800">
              {cart.items.length} {cart.items.length === 1 ? "Item" : "Items"}{" "}
              in your Cart
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "cart"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <ShoppingCart className="h-6 w-6 " />
                </div>
                <span className="font-medium hidden md:inline">Cart</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "address"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <MapPin className="h-6 w-6 " />
                </div>
                <span className="font-medium hidden md:inline">Address</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "payment"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <CreditCard className="h-6 w-6 " />
                </div>
                <span className="font-medium hidden md:inline">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl ">Order Summary</CardTitle>
                  <CardDescription>Review Your Items</CardDescription>
                </CardHeader>

                <CardContent>
                  <CartItems
                    items={cart.items}
                    onRemoveItem={handleRemoveItem}
                    onToggleWishlist={handleAddToWhishlist}
                    wishlist={wishlist}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <PriceDetails
                totalOriginalAmount={totalOriginalAmount}
                totalAmount={finalAmount}
                shippingCharge={maximumShippingCharge}
                totalDiscount={totalDiscount}
                itemCount={cart.items.length}
                isProcessing={isProcessing}
                step={step}
                onProceed={handleProceedToCheckout}
                onBack={() =>
                  dispatch(
                    setCheckoutStep(step === "address" ? "cart" : "address")
                  )
                }
              />

              {selectedAddress && (
                <Card className="mt-6 mb-6 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p>{selectedAddress?.state}</p>
                      {selectedAddress?.addressLine2 && (
                        <p>{selectedAddress?.addressLine2}</p>
                      )}
                      <p>
                        {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.pincode}
                      </p>
                      <p>Phone: {selectedAddress.phoneNumber}</p>
                    </div>

                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => setShowAddressDialog(true)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Change Address
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Select or Add Delivery Address</DialogTitle>
              </DialogHeader>
              <CheckoutAddress
                onAddressSelect={handleSelectedAddress}
                selectedAddressId={selectedAddress?._id}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default page;
