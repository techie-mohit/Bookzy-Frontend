import { useAddToWishlistMutation, useGetCartQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from '@/store/api';
import { setCart } from '@/store/slice/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const {orderId , step} = useSelector((state: RootState)=> state.checkout);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);  
  const {data: cartData, isLoading:isCartLoading} = useGetCartQuery(user?._id);
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);

  useEffect(()=>{
    if(cartData?.successful && cartData?.data){
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const handleRemoveItem = async(productId: string) => {
    try {
      const result = await removeCartMutation(productId).unwrap();
      if(result.success){
        dispatch(setCart(result.data));
        toast.success(result.message || "Item removed from cart");
      }
    } catch (error) {
      console.log("Remove from cart error", error);
      toast.error("Failed to remove item from cart");
    }
  }

  const handleAddToWhishlist = async(productId: string) => {
      try {
        const isWishlist = wishlist.some((item)=> item.products.includes(productId))
  
        if(isWishlist){
          const result = await removeWishlistMutation(productId).unwrap();
          if(result.success){
            dispatch(removeFromWishlist(productId));
            toast.success(result.message || "Removed from wishlist");
          }else{
            throw new Error(result.message || "Failed to remove from wishlist");
          }
        }else{
          const result = await addToWishlistMutation(productId).unwrap();
          if(result.success && result.data){
            dispatch(addToWishlist(result.data));
            toast.success(result.message || "Added to wishlist successfully");
          }else{
            throw new Error(result.message || "Failed to add to wishlist");
          }
        }  
      } catch (error:any) {
         const errormessage = error?.data?.message;
          toast.error(errormessage || 'Failed to add/remove to wishlist');
        
      }
    };

    


  return (
    <div>
      page
    </div>
  )
}

export default page