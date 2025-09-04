"use client";
import NoData from "@/app/components/NoData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookLoader from "@/lib/BookLoader";
import { BookDetails } from "@/lib/types/type";
import { useAddToCartMutation, useAddToWishlistMutation, useGetProductByIdQuery, useRemoveFromWishlistMutation } from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { format, formatDistanceToNow } from "date-fns";
import { CheckCircle2, Heart, HeartIcon, HeartOffIcon, Loader, Loader2, MapPin, MessageCircle, Phone, Share, Share2, ShoppingCart, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";


const page = () => {
  const params = useParams();
  const id = params.id;
  const [selectedImage, setSelectedImage] = React.useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAddToCart, setIsAddToCart] = React.useState(false);

  const {data:apiResponse= {}, isLoading, isError} = useGetProductByIdQuery(id);
  const [book, setBook] = useState<BookDetails | null>(null);
  const [addToCartMutation]  = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);


  useEffect(()=>{
    if(apiResponse.success){
      setBook(apiResponse.data);
    }
  }, [apiResponse])

  

  const handleAddToCart = async() => {
    if(book){
      setIsAddToCart(true);
      try {
        const result = await addToCartMutation({productId: book?._id, quantity: 1}).unwrap();
        if(result.success && result.data){
          dispatch(addToCart(result.data));
          toast.success(result.message || "Added to cart successfully")
          
        }else{
          throw new Error(result.message || "Failed to add to cart");
        }
      } catch (error: any) {
        const errormessage = error?.data?.message;
        toast.error(errormessage);
        
      }
      finally{
        setIsAddToCart(false);
      }
    }
  };

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

  const bookImage = book?.images || [];

  if(isLoading){
    return <BookLoader/>
  }

  if (!book || isError) {
        return (
          <div className="my-10 max-w-3xl justify-center mx-auto">
            <NoData
              imageUrl="/images/no-book.jpg"
              message="Loading...."
              description="Wait, we are fetching book details"
              onClick={() => router.push("/book-sell")}
              buttonText="Sell Your First Book"
            />
          </div>
        );
      }

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const formData = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4  py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline ">
            {" "}
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="text-primary hover:underline">
            Books
          </Link>
          <span>/</span>
          <span className="text-gray-600">{book.category}</span>
          <span>/</span>
          <span className="text-gray-600">{book.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg border bg-white shadow-md">
              <Image
                src={bookImage[selectedImage]}
                alt={book.title}
                fill
                className="object-contain"
              />
              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                <div className="absolute left-0 top-2 rounded-r-lg  px-2 bg-orange-500 text-sm font-medium text-white">
                  {calculateDiscount(book.price, book.finalPrice)}% OFF
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {bookImage.map((images, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-white opacity-50 blur-[1px]"
                  }`}
                >
                  <Image
                    src={images}
                    alt={`${book.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* book details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {" "}
                  Posted {format(book.createdAt, "d MMMM yyyy")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleAddToCart}>
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Share</span>
                </Button>
                <Button
                  onClick={() => handleAddToWhishlist(book._id)}
                  variant="outline"
                  size="sm"
                >
                  <Heart className={`h-4 w-4 mr-1 ${wishlist.some((w)=> w.products.includes(book._id)) ? "fill-red-500" : ""}`} />
                  <span className="hidden md:inline">{wishlist.some((w)=> w.products.includes(book._id)) ? "Remove" : "Add "}</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-2 ">
                <span className="">
                  ₹<span className="text-2xl font-bold">{book.finalPrice}</span>
                </span>
                {book.price && (
                  <span className="text-lg line-through text-muted-foreground">
                    ₹{book.price}
                  </span>
                )}

                <Badge variant="secondary" className="text-green-500">Shipping Available</Badge>
              </div>

              <Button className="w-40 py-6 bg-blue-700" onClick={handleAddToCart} disabled={isAddToCart}>
                {
                  isAddToCart ? (
                    <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" size={20}/>
                    Adding to cart...
                    </>
                  ):(
                    <>
                    <ShoppingCart className="mr-2 h-5 w-5 " />
                    Buy Now
                    </>
                  )
                }
              </Button>

              <Card className="border border-gray-200">
                <CardHeader className="text-lg font-semibold">
                  <CardTitle>Book Details</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="font-medium text-muted-foreground">Subject/Title</div>
                    <div className="text-muted-foreground">{book.title}</div>
                    <div className="font-medium text-muted-foreground">Course</div>
                    <div className="text-muted-foreground">{book.classType}</div>
                    <div className="font-medium text-muted-foreground">Category</div>
                    <div className="text-muted-foreground">{book.category}</div>
                    <div className="font-medium text-muted-foreground">Author</div>
                    <div className="text-muted-foreground">{book.author}</div>
                    <div className="font-medium text-muted-foreground">Edition</div>
                    <div className="text-muted-foreground">{book.edition}</div>
                    <div className="font-medium text-muted-foreground">Condition</div>
                    <div className="text-muted-foreground">{book.condition}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{book.description}</p>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Our Community</h3>
                <p className="text-sm text-muted-foreground">
                  We are not just another shopping website where you can buy books. We are a community of book lovers who believe in sharing knowledge and resources. Join us in our mission to make education accessible to all.
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div>Ad Id: {book._id} </div>
                <div>Posted {format(book.createdAt, "d MMMM yyyy")}</div>
              </div>
            </CardContent>
          </Card>


          {/* Book Seller Details */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sold By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className=" h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center">
                    <User2 className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{book.seller.name}</span>
                    <Badge variant="secondary" className="text-green-500">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4"/>
                    {/* <span>
                      {
                        book.seller?.addresses?.[0].city?
                        `${book.seller?.addresses?.[0].city}, ${book.seller?.addresses?.[0].state}`
                        : "Location Not Specified"
                      }
                    </span> */}
                    <span>Varansi</span>
                  </div>
                  </div>
                </div>
              </div>

              {book.seller.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="ml-2 h-4 w-4" />
                  <span className="font-medium">Contact:</span>
                  <span>{book.seller.phoneNumber}</span>
                </div>
              )}
              
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default page;
